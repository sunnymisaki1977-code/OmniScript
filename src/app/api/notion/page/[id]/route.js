import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id: pageId } = await params;
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Notion API key is missing." },
        { status: 500 }
      );
    }

    const notion = new Client({ auth: apiKey });
    
    // 取回 Page 的標題以做為 theme
    const page = await notion.pages.retrieve({ page_id: pageId });
    const titleProperty = Object.values(page.properties).find(
      (p) => p.type === "title"
    );
    let theme = "未命名專案";
    if (titleProperty && titleProperty.title.length > 0) {
      theme = titleProperty.title.map((t) => t.plain_text).join("");
    }
    theme = theme.replace("OmniScript: ", "");

    // 取回 Page 的 Blocks
    let allBlocks = [];
    let cursor = undefined;

    while (true) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });
      allBlocks.push(...response.results);
      if (response.has_more) {
        cursor = response.next_cursor;
      } else {
        break;
      }
    }

    const stepData = {};
    const stepImages = {};
    let currentStepKey = null;
    let lastHeading3 = null;

    // 解析 Blocks 反向還原成 stepData
    for (const block of allBlocks) {
      if (block.type === "heading_2") {
        const text = block.heading_2.rich_text.map(t => t.plain_text).join("");
        // 匹配 "1. 基礎背景研究" 取得數字 1
        const match = text.match(/^(\d+)\./);
        if (match) {
          currentStepKey = `step${match[1]}`;
          stepData[currentStepKey] = "";
          stepImages[currentStepKey] = {};
        }
      } else if (block.type === "heading_3") {
        lastHeading3 = block.heading_3.rich_text.map(t => t.plain_text).join("");
      } else if (currentStepKey) {
        if (block.type === "paragraph") {
          const text = block.paragraph.rich_text.map(t => t.plain_text).join("");
          stepData[currentStepKey] += text + "\n\n";
        } else if (block.type === "code") {
          const text = block.code.rich_text.map(t => t.plain_text).join("");
          stepData[currentStepKey] += text + "\n\n";
        } else if (block.type === "bulleted_list_item") {
          const text = block.bulleted_list_item.rich_text.map(t => t.plain_text).join("");
          stepData[currentStepKey] += "- " + text + "\n";
        } else if (block.type === "image" || block.type === "video" || block.type === "audio") {
          const media = block[block.type];
          if (media.type === "external" && lastHeading3 && lastHeading3.startsWith("匯入的媒體檔案")) {
            const proposalMatch = lastHeading3.match(/提案\s*(\d+)/);
            if (proposalMatch) {
              const bubbleIndex = parseInt(proposalMatch[1], 10) - 1;
              stepImages[currentStepKey][bubbleIndex] = media.external.url;
            }
          }
        }
      }
    }

    // 清理結尾的換行符號
    Object.keys(stepData).forEach(key => {
      stepData[key] = stepData[key].trim();
    });

    return NextResponse.json({ success: true, theme, stepData, stepImages });
  } catch (error) {
    console.error("Notion API GET Blocks Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch and parse Notion page", details: error.message },
      { status: 500 }
    );
  }
}
