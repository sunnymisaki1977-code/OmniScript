import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const pageId = formData.get("pageId");
    const stepId = formData.get("stepId");
    const bubbleIndex = formData.get("bubbleIndex");

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

    const notion = new Client({ auth: apiKey });
    
    // 1. 上傳檔案至 Vercel Blob
    let blob;
    try {
      blob = await put(file.name, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
    } catch (err) {
      if (err.message && err.message.includes('private store')) {
        console.warn("Vercel Blob store is private. Falling back to private access...");
        blob = await put(file.name, file, {
          access: 'private',
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
      } else {
        throw err;
      }
    }

    // 判斷檔案類型以決定 Notion Block Type
    let blockType = "file";
    if (file.type.startsWith("image/")) blockType = "image";
    else if (file.type.startsWith("video/")) blockType = "video";
    else if (file.type.startsWith("audio/")) blockType = "audio";

    // 2. 尋找要插入的目標區塊 (如果前端有提供 stepId)
    let insertAfterId = undefined;
    if (stepId) {
      try {
        let hasMore = true;
        let nextCursor = undefined;
        
        while (hasMore && !insertAfterId) {
          const blocksResponse = await notion.blocks.children.list({ 
            block_id: pageId,
            start_cursor: nextCursor
          });
          
          const targetBlock = blocksResponse.results.find(block => {
            if (block.type === 'heading_2' && block.heading_2.rich_text.length > 0) {
              const text = block.heading_2.rich_text.map(rt => rt.plain_text).join("");
              // 匹配 '6. ' 或 'Step 6' 等可能的格式
              return text.startsWith(`${stepId}. `) || text.includes(`Step ${stepId}`);
            }
            return false;
          });
          
          if (targetBlock) {
            insertAfterId = targetBlock.id;
          }
          
          hasMore = blocksResponse.has_more;
          nextCursor = blocksResponse.next_cursor;
        }
      } catch (err) {
        console.warn("Failed to find target block for precise insertion, falling back to end of page", err);
      }
    }

    // 3. 將 Vercel Blob 的公開網址以 External 形式附加到 Notion 頁面中
    const appendPayload = {
      block_id: pageId,
      children: [
        {
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [
              {
                type: "text",
                text: { content: `匯入的媒體檔案 - 提案 ${bubbleIndex !== null ? parseInt(bubbleIndex) + 1 : 1}` },
              },
            ],
          },
        },
        {
          object: "block",
          type: blockType,
          [blockType]: {
            type: "external",
            external: {
              url: blob.url,
            },
          },
        },
      ],
    };

    if (insertAfterId) {
      appendPayload.after = insertAfterId;
    }

    await notion.blocks.children.append(appendPayload);

    // 回傳 blob.url 給前端進行預覽
    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error("Notion/Blob Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload file: " + error.message, details: error.message },
      { status: 500 }
    );
  }
}
