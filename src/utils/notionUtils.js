/**
 * utils/notionUtils.js
 * 處理 Notion API 相關的輔助函式
 */

// 確保單一段落不超過 2000 字元限制
export function createSafeParagraphBlocks(longText) {
  if (!longText) return [];

  const MAX_LENGTH = 2000;
  const blocks = [];

  // 先用兩個換行符號或單個換行符號進行切割
  const paragraphs = longText.split(/\n\n|\n/).filter((p) => p.trim() !== "");

  for (const p of paragraphs) {
    if (p.length <= MAX_LENGTH) {
      blocks.push(createParagraphBlock(p));
    } else {
      // 若超過 2000 字元，進行強制切割 (Chunking)
      let currentIdx = 0;
      while (currentIdx < p.length) {
        const chunk = p.substring(currentIdx, currentIdx + MAX_LENGTH);
        blocks.push(createParagraphBlock(chunk));
        currentIdx += MAX_LENGTH;
      }
    }
  }

  return blocks;
}

function createParagraphBlock(text) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: {
            content: text,
          },
        },
      ],
    },
  };
}

export function createHeading2Block(text) {
  return {
    object: "block",
    type: "heading_2",
    heading_2: {
      rich_text: [
        {
          type: "text",
          text: {
            content: text,
          },
        },
      ],
    },
  };
}

export function createCodeBlock(text) {
  return {
    object: "block",
    type: "code",
    code: {
      rich_text: [
        {
          type: "text",
          text: {
            content: text,
          },
        },
      ],
      language: "plain text",
    },
  };
}
