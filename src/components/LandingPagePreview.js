import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, Image as ImageIcon, Code } from 'lucide-react';

export default function LandingPagePreview({ parsedData }) {
  const previewRef = useRef(null);
  
  const [heroImage, setHeroImage] = useState(null);
  const [painPointImages, setPainPointImages] = useState({});
  const [solutionImages, setSolutionImages] = useState({});

  const handleImageUpload = (e, setter, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        if (key !== undefined) {
          setter(prev => ({ ...prev, [key]: url }));
        } else {
          setter(url);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const exportPNG = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { useCORS: true, scale: 2 });
    const link = document.createElement('a');
    link.download = 'landing_page_preview.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportHTML = () => {
    if (!previewRef.current) return;
    // 移除上傳 input 以便產生純淨的 HTML
    let domHtml = previewRef.current.outerHTML.replace(/<input type="file"[^>]*>/g, '');
    
    // Generate a static HTML string using Tailwind CDN
    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${parsedData?.heroTitle || 'Landing Page'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 font-sans">
  <div class="flex justify-center py-10">
    ${domHtml}
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.download = 'landing_page.html';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  if (!parsedData) return <div className="p-8 text-center text-slate-500">暫無預覽資料</div>;

  const ImageUploader = ({ imgUrl, onUpload, className, placeholderText = "點擊上傳圖片" }) => (
    <div className={`relative group overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-colors hover:border-amber-400 ${className}`}>
      {imgUrl ? (
        <img src={imgUrl} alt="uploaded" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center text-slate-400 group-hover:text-amber-500 transition-colors">
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">{placeholderText}</span>
        </div>
      )}
      <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span className="text-amber-500">👁️</span> 網頁即時預覽
        </h3>
        <div className="flex gap-3">
          <button onClick={exportHTML} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg transition-colors border border-slate-200 dark:border-slate-600">
            <Code className="w-4 h-4" /> 匯出為單檔 HTML
          </button>
          <button onClick={exportPNG} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-amber-200 dark:shadow-none">
            <Download className="w-4 h-4" /> 儲存為圖片 (PNG)
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {/* 這個 div 是截圖的目標範圍 */}
        <div ref={previewRef} className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
          
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white py-20 px-8 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 leading-tight pb-2">
                {parsedData.heroTitle}
              </h1>
              <p className="text-lg md:text-xl font-medium opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed text-slate-300">
                {parsedData.heroSubtitle}
              </p>
              
              <ImageUploader 
                imgUrl={heroImage} 
                onUpload={(e) => handleImageUpload(e, setHeroImage)} 
                className="w-full max-w-3xl mx-auto h-64 md:h-[400px] shadow-2xl bg-white/5 border-white/20 hover:border-amber-400"
                placeholderText="上傳主視覺 (Hero Image) 建議比例 16:9"
              />
            </div>
          </section>

          {/* Pain Points Section */}
          <section className="py-20 px-8 bg-slate-50">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-4">遇到這些問題嗎？</h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto mb-12 rounded-full"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {parsedData.painPoints.map((point, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                    <ImageUploader 
                      imgUrl={painPointImages[idx]} 
                      onUpload={(e) => handleImageUpload(e, setPainPointImages, idx)} 
                      className="w-full h-40 mb-6 bg-slate-50"
                      placeholderText="上傳情境圖"
                    />
                    <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                      {idx + 1}
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Solutions Section */}
          <section className="py-20 px-8 bg-white">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-4">唯一完美解方</h2>
              <div className="w-24 h-1 bg-emerald-500 mx-auto mb-16 rounded-full"></div>
              
              <div className="space-y-16">
                {parsedData.solutions.map((solution, idx) => (
                  <div key={idx} className={`flex flex-col md:flex-row items-center gap-10 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="flex-1 w-full">
                      <ImageUploader 
                        imgUrl={solutionImages[idx]} 
                        onUpload={(e) => handleImageUpload(e, setSolutionImages, idx)} 
                        className="w-full h-64 md:h-72 shadow-xl bg-slate-50"
                        placeholderText="上傳產品特色圖"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-extrabold text-xl shrink-0 shadow-sm">
                          ✓
                        </div>
                        <p className="text-slate-700 text-lg leading-relaxed pt-2 font-medium">{solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-8 bg-slate-900 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/40 via-slate-900 to-slate-900 pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold text-white mb-10">準備好升級你的體驗了嗎？</h2>
              <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
                {parsedData.ctaButtons.map((cta, idx) => (
                  <button key={idx} className="w-full py-5 px-8 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/20 transition-transform transform hover:scale-105 border border-amber-400/30">
                    {cta}
                  </button>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
