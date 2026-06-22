/**
 * utils/notionUtils.js
 * 處理 Notion API 相關的輔助函式
 */

// 確保單一段落不超過 2000 字元限制
export function createSafeParagraphBlocks(longText) {
  if (!longText) return [];

  const MAX_LENGTH = 2000;
  const blocks = [];
  
  // 防呆：如果傳入的 longText 是物件，強制轉為字串
  let textToProcess = longText;
  if (typeof textToProcess === "object") {
    try {
      textToProcess = Object.entries(textToProcess)
        .map(([k, v]) => Array.isArray(v) ? `【${k}】\n${v.join('\n')}` : `【${k}】\n${v}`)
        .join('\n\n');
    } catch(e) {
      textToProcess = JSON.stringify(textToProcess, null, 2);
    }
  } else {
    textToProcess = String(textToProcess);
  }

  // 先用兩個換行符號或單個換行符號進行切割
  const paragraphs = textToProcess.split(/\n\n|\n/).filter((p) => p.trim() !== "");

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

export function createSafeCodeBlocks(text, language = "plain text") {
  if (!text) return [];

  const MAX_LENGTH = 2000;
  const blocks = [];
  
  let safeText = text;
  if (typeof safeText === "object") {
    try {
      safeText = JSON.stringify(safeText, null, 2);
    } catch(e) {
      safeText = String(safeText);
    }
  } else {
    safeText = String(safeText || "");
  }

  // 將文字按行切分，儘量在換行處進行切割，避免單字斷裂
  const lines = safeText.split('\n');
  let currentChunk = "";

  for (const line of lines) {
    // 如果單獨一行就超過 2000 字，必須強制硬切
    if (line.length > MAX_LENGTH) {
      if (currentChunk) {
        blocks.push(createCodeBlock(currentChunk, language));
        currentChunk = "";
      }
      let idx = 0;
      while (idx < line.length) {
        blocks.push(createCodeBlock(line.substring(idx, idx + MAX_LENGTH), language));
        idx += MAX_LENGTH;
      }
    } else {
      // 檢查加上這行是否會超過限制
      if (currentChunk.length + line.length + 1 > MAX_LENGTH) {
        blocks.push(createCodeBlock(currentChunk, language));
        currentChunk = line;
      } else {
        currentChunk += (currentChunk ? '\n' : '') + line;
      }
    }
  }

  if (currentChunk) {
    blocks.push(createCodeBlock(currentChunk, language));
  }

  return blocks;
}

export function createCodeBlock(text, language = "plain text") {
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
      language: language,
    },
  };
}
