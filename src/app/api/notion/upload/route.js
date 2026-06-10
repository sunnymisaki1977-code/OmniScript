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

    // 嘗試附加到 Notion Page
    const notion = new Client({ auth: apiKey });
    
    // 1. 初始化上傳
    const uploadRes = await notion.fileUploads.create({
      mode: "single_part",
    });
    
    // 2. 送出檔案 (讀取為 Buffer 以避免 Node.js fetch stream deadlock 導致 ECONNRESET)
    const arrayBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([arrayBuffer], { type: file.type });
    const uploadFormData = new FormData();
    uploadFormData.append("file", fileBlob, file.name);

    const sendRes = await fetch(uploadRes.upload_url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28"
      },
      body: uploadFormData
    });

    if (!sendRes.ok) {
      const errorText = await sendRes.text();
      throw new Error(`Upload failed: ${sendRes.status} ${errorText}`);
    }

    // 判斷檔案類型以決定 Notion Block Type
    let blockType = "file";
    if (file.type.startsWith("image/")) blockType = "image";
    else if (file.type.startsWith("video/")) blockType = "video";
    else if (file.type.startsWith("audio/")) blockType = "audio";

    // 3. 將上傳的檔案附加到 Notion 頁面中
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
                text: { content: "匯入的媒體檔案" },
              },
            ],
          },
        },
        {
          object: "block",
          type: blockType,
          [blockType]: {
            type: "file_upload",
            file_upload: {
              id: uploadRes.id,
            },
          },
        },
      ],
    });

    return NextResponse.json({ success: true, url: uploadRes.upload_url });
  } catch (error) {
    console.error("Notion API Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Notion", details: error.message },
      { status: 500 }
    );
  }
}
