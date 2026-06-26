import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { WORKFLOW_STEPS } from "@/utils/promptConfigs";
import {
  createSafeParagraphBlocks,
  createHeading2Block,
  createSafeCodeBlocks,
} from "@/utils/notionUtils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  try {
    const { context, creatorName } = await req.json();
    const theme = context.theme;

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: "Notion API key or Database ID is missing in environment variables." },
        { status: 500, headers: corsHeaders }
      );
    }

    const notion = new Client({ auth: apiKey });

    // 準備所有的 Blocks
    const childrenBlocks = [];

    if (creatorName) {
      const timeStr = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
      childrenBlocks.push(...createSafeParagraphBlocks(`歸檔人員：${creatorName}\n歸檔時間：${timeStr}\n\n---\n`));
    }

    // 依序處理每個步驟
    for (const step of WORKFLOW_STEPS) {
      const stepData = context[`step${step.id}`];
      if (!stepData) continue;

      // 加入步驟標題 (Heading 2)
      childrenBlocks.push(createHeading2Block(`${step.id}. ${step.title}`));

      // 根據步驟類型加入不同的 Block
      if (step.type === "code") {
        // Step 6-8, 9 是 Code 區塊
        const codeBlocks = createSafeCodeBlocks(stepData);
        childrenBlocks.push(...codeBlocks);
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

    return NextResponse.json({ success: true, url: response.url, id: response.id }, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Notion API Error:", error);
    return NextResponse.json(
      { error: "Failed to export to Notion", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(req) {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: "Notion API key or Database ID is missing." },
        { status: 500, headers: corsHeaders }
      );
    }

    const notion = new Client({ auth: apiKey });
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get('pageId');

    // 如果沒有 pageId，回傳專案清單
    if (!pageId) {
      // 在新版 Notion SDK v5 中 databases.query 的寫法已改變，我們直接用 REST API 確保相容性
      const queryResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sorts: [{ timestamp: "created_time", direction: "descending" }],
          page_size: 10 // 限制只抓取最新的 10 筆資料
        })
      });
      
      const response = await queryResponse.json();

      if (!queryResponse.ok) {
        throw new Error(response.message || "Failed to query database");
      }

      const results = response.results.map(page => {
        let titleStr = "未命名專案";
        
        // 安全地尋找型別為 'title' 的屬性（因為使用者資料庫的標題欄位名稱不一定是 'title'）
        const titlePropKey = Object.keys(page.properties).find(k => page.properties[k].type === 'title');
        const titleProp = titlePropKey ? page.properties[titlePropKey] : null;

        if (titleProp && titleProp.title && titleProp.title.length > 0) {
          titleStr = titleProp.title.map(t => t.plain_text).join("");
        }
        
        const dateObj = new Date(page.created_time);
        const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

        return {
          id: page.id,
          title: titleStr,
          createdTime: formattedDate
        };
      });

      return NextResponse.json({ results }, { status: 200, headers: corsHeaders });
    }

    // 如果有 pageId，回傳該頁面詳細內容並解析回 step1 ~ step9
    const pageResponse = await notion.pages.retrieve({ page_id: pageId });
    let themeTitle = "未命名企劃";
    
    const pageTitlePropKey = Object.keys(pageResponse.properties).find(k => pageResponse.properties[k].type === 'title');
    const pageTitleProp = pageTitlePropKey ? pageResponse.properties[pageTitlePropKey] : null;

    if (pageTitleProp && pageTitleProp.title && pageTitleProp.title.length > 0) {
      themeTitle = pageTitleProp.title.map(t => t.plain_text).join("");
      themeTitle = themeTitle.replace(/^OmniScript:\s*/, '');
    }

    // 取得所有 Blocks
    let allBlocks = [];
    let cursor = undefined;
    while (true) {
      const blocksResponse = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });
      allBlocks.push(...blocksResponse.results);
      if (blocksResponse.has_more) {
        cursor = blocksResponse.next_cursor;
      } else {
        break;
      }
    }

    // 解析 Blocks 回填到 context
    const context = { theme: themeTitle };
    let currentStep = null;

    for (const block of allBlocks) {
      if (block.type === 'heading_2') {
        const text = block.heading_2.rich_text.map(t => t.plain_text).join("");
        const match = text.match(/^(\d+)\./);
        if (match) {
          currentStep = `step${match[1]}`;
          if (!context[currentStep]) context[currentStep] = "";
        }
      } else if (currentStep) {
        if (block.type === 'paragraph') {
          const text = block.paragraph.rich_text.map(t => t.plain_text).join("");
          if (text) context[currentStep] += text + "\n\n";
        } else if (block.type === 'code') {
          const text = block.code.rich_text.map(t => t.plain_text).join("");
          if (text) context[currentStep] += "```\n" + text + "\n```\n\n";
        } else if (block.type === 'quote') {
          const text = block.quote.rich_text.map(t => t.plain_text).join("");
          if (text) context[currentStep] += "> " + text + "\n\n";
        }
      }
    }

    return NextResponse.json({ context }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("Notion GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Notion", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
