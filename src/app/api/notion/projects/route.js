import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      return NextResponse.json(
        { error: "Notion API key or Database ID is missing." },
        { status: 500 }
      );
    }

    const notion = new Client({ auth: apiKey });

    // 使用 search 來取得最近歸檔的專案，因為部分 Client 版本不支援 query
    const response = await notion.search({
      filter: { property: "object", value: "page" },
      sort: { direction: "descending", timestamp: "last_edited_time" }
    });

    // 過濾出屬於該資料庫的頁面
    const dbPages = response.results.filter(
      p => p.parent && p.parent.database_id && p.parent.database_id.replace(/-/g, '') === databaseId.replace(/-/g, '')
    ).slice(0, 20);

    const projects = dbPages.map((page) => {
      // 嘗試獲取 Title 屬性
      const titleProperty = Object.values(page.properties).find(
        (p) => p.type === "title"
      );
      
      let title = "未命名專案";
      if (titleProperty && titleProperty.title && titleProperty.title.length > 0) {
        title = titleProperty.title.map((t) => t.plain_text).join("");
      }

      // 如果有 OmniScript 前綴，清理一下
      title = title.replace("OmniScript: ", "");

      return {
        id: page.id,
        theme: title,
        url: page.url,
        updatedAt: page.created_time,
        currentStep: 9, // 來自 Notion 代表已歸檔 (Step 9)
        mode: "auto", // 預設給一個模式
        isArchived: true,
      };
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Notion API GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Notion", details: error.message },
      { status: 500 }
    );
  }
}
