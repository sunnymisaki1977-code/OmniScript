export function parseLandingPageText(text) {
  if (!text) return null;

  // 輔助函式：提取段落文字
  const extractSection = (headerRegex, nextHeaderRegex = /【/) => {
    const match = text.match(headerRegex);
    if (!match) return "";
    const startIndex = match.index + match[0].length;
    let endIndex = text.length;
    
    // 尋找下一個 【 或結束
    if (nextHeaderRegex) {
      const textAfter = text.substring(startIndex);
      const nextMatch = textAfter.match(nextHeaderRegex);
      if (nextMatch) {
        endIndex = startIndex + nextMatch.index;
      }
    }
    
    return text.substring(startIndex, endIndex).replace(/\*\*/g, '').trim();
  };

  const heroTitle = extractSection(/【黃金主視覺大標】/);
  const heroSubtitle = extractSection(/【副標題】/);
  const painPointsText = extractSection(/【三大痛點共鳴】/);
  const solutionsText = extractSection(/【產品解方與利益】/);
  const ctaText = extractSection(/【限時優惠 CTA 按鈕】/, null);

  // 解析陣列 (依照數字或星號條列)
  const parseList = (rawStr) => {
    if (!rawStr) return [];
    return rawStr
      .split('\n')
      .map(line => line.trim())
      // 匹配數字點 (1.)、星號 (*)、減號 (-)
      .filter(line => line.match(/^(\d+\.|[\*\-])/)) 
      .map(line => line.replace(/^(\d+\.|[\*\-])\s*/, '').replace(/\*\*/g, '').trim());
  };

  return {
    heroTitle: heroTitle || "一鍵生成：請先於企劃區產生文案",
    heroSubtitle: heroSubtitle || "如果尚未產生文案，請先切換回企劃編輯器並點擊生成。",
    painPoints: parseList(painPointsText).length > 0 ? parseList(painPointsText) : ["痛點 1...", "痛點 2...", "痛點 3..."],
    solutions: parseList(solutionsText).length > 0 ? parseList(solutionsText) : ["解方 1...", "解方 2...", "解方 3..."],
    ctaButtons: parseList(ctaText).length > 0 ? parseList(ctaText) : ["立即購買！"]
  };
}
