import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { WORKFLOW_REGISTRY } from "@/utils/promptConfigs";
import {
  createSafeParagraphBlocks,
  createHeading2Block,
  createCodeBlock,
} from "@/utils/notionUtils";

export async function POST(req) {
  try {
    const { context, creatorName, mode = "creator" } = await req.json();
    const theme = context.theme;

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = mode === 'ecommerce' 
      ? (process.env.NOTION_ECOMMERCE_DATABASE_ID || "37bcf7781506807b9031d8db8dc83dd1")
      : process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: "Notion API key or Database ID is missing in environment variables." },
        { status: 500 }
      );
    }

    const notion = new Client({ auth: apiKey });

    // 準備所有的 Blocks
    const childrenBlocks = [];

    if (creatorName) {
      const timeStr = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
      childrenBlocks.push(...createSafeParagraphBlocks(`歸檔人員：${creatorName}\n歸檔時間：${timeStr}\n\n---\n`));
    }

    const currentWorkflowSteps = WORKFLOW_REGISTRY[mode] || WORKFLOW_REGISTRY.creator;
    // 依序處理每個步驟
    for (const step of currentWorkflowSteps) {
      const stepData = context[`step${step.id}`];
      if (!stepData) continue;

      // 加入步驟標題 (Heading 2)
      childrenBlocks.push(createHeading2Block(`${step.id}. ${step.title}`));

      // 根據步驟類型加入不同的 Block
      if (step.type === "code") {
        // Step 6-8 是 Code 區塊
        childrenBlocks.push(createCodeBlock(stepData));
      } else {
        // Step 1-5, 9 是 Text 區塊
        const paragraphs = createSafeParagraphBlocks(stepData);
        childrenBlocks.push(...paragraphs);
      }
    }

    // Notion API 限制每次請求最多只能建立 100 個區塊 (blocks)
    // 我們需要將 blocks 分批處理
    const chunkedBlocks = [];
    for (let i = 0; i < childrenBlocks.length; i += 100) {
      chunkedBlocks.push(childrenBlocks.slice(i, i + 100));
    }

    // 建立 Notion Page，並帶入第一批 (最多 100 個) Blocks
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: `OmniScript: ${theme}`,
              },
            },
          ],
        },
      },
      children: chunkedBlocks.length > 0 ? chunkedBlocks[0] : [],
    });

    // 如果還有剩餘的 Blocks，使用 append 方法加入到剛建立的頁面中
    for (let i = 1; i < chunkedBlocks.length; i++) {
      await notion.blocks.children.append({
        block_id: response.id,
        children: chunkedBlocks[i]
      });
    }

    return NextResponse.json({ success: true, url: response.url });
  } catch (error) {
    console.error("Notion API Error:", error);
    return NextResponse.json(
      { error: "Failed to export to Notion", details: error.message },
      { status: 500 }
    );
  }
}
