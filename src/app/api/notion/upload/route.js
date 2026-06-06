import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const pageId = formData.get("pageId");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!pageId) {
      return NextResponse.json({ error: "Missing Notion pageId" }, { status: 400 });
    }

    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Notion API key is missing." }, { status: 500 });
    }

    // 儲存檔案到 public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // 產生公開網址 (若部署至遠端，請替換為實際網域)
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    const fileUrl = `${protocol}://${host}/uploads/${filename}`;

    // 嘗試附加到 Notion Page
    const notion = new Client({ auth: apiKey });
    
    // 注意：Notion API 目前不支援直接上傳二進位圖片至其伺服器，
    // 因此這裡使用 external URL。如果使用的是 localhost，
    // Notion 網頁版可能會因為無法連線本地端而無法顯示預覽。
    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [
              {
                type: "text",
                text: { content: "匯入的生成圖像" },
              },
            ],
          },
        },
        {
          object: "block",
          type: "image",
          image: {
            type: "external",
            external: {
              url: fileUrl,
            },
          },
        },
      ],
    });

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Notion API Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Notion", details: error.message },
      { status: 500 }
    );
  }
}
