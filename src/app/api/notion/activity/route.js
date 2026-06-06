import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// Using the Database ID provided by the user for the System Log
const ACTIVITY_DB_ID = "377cf7781506809e98d5f1163b1067d5";

export async function POST(req) {
  try {
    const { name, role, action } = await req.json();
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Notion API Key" }, { status: 500 });
    }

    const notion = new Client({ auth: apiKey });

    // Format time (e.g. 14:30) using Taipei timezone
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Format: [10:30] 小明 完成了【三國演義】的 Gemini 視覺圖產製
    const rolePrefix = role && role !== "未定" ? `${role} ` : "";
    const logMessage = `[${timeString}] ${rolePrefix}${name} ${action}`;

    await notion.pages.create({
      parent: { database_id: ACTIVITY_DB_ID },
      properties: {
        // The default title column is usually named "Name" or "標題"
        // In Notion API, you can target the title property implicitly by its type "title" 
        // without knowing its exact localized name by just using a known key if it exists,
        // but it's safer to use the property ID "title" or just "Name". 
        // We will assume the default name is "Name".
        "Name": {
          title: [
            {
              text: {
                content: logMessage,
              },
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notion Activity API Error:", error);
    return NextResponse.json(
      { error: "Failed to log activity", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Notion API Key" }, { status: 500 });
    }

    const notion = new Client({ auth: apiKey });

    // Fetch the latest activities using search and filtering by database ID
    const response = await notion.search({
      filter: { property: "object", value: "page" },
      sort: { direction: "descending", timestamp: "last_edited_time" }
    });

    const dbPages = response.results.filter(
      p => p.parent && p.parent.database_id && p.parent.database_id.replace(/-/g, '') === ACTIVITY_DB_ID.replace(/-/g, '')
    ).slice(0, 10);

    const logs = dbPages.map((page) => {
      // Extract the text from the title property
      // We look for a property of type "title"
      const titlePropertyKey = Object.keys(page.properties).find(
        (key) => page.properties[key].type === "title"
      );
      
      let text = "未知活動紀錄";
      if (titlePropertyKey) {
        const titleArr = page.properties[titlePropertyKey].title;
        if (titleArr && titleArr.length > 0) {
          text = titleArr.map(t => t.plain_text).join("");
        }
      }
      
      return {
        id: page.id,
        text,
        timestamp: page.created_time
      };
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Notion Fetch Activity Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities", details: error.message },
      { status: 500 }
    );
  }
}
