@echo off
:: 切換到批次檔所在的目錄，避免路徑錯誤
cd /d "%~dp0"

echo ==============================================
echo      OmniScript (全域腳本) 本機啟動程式
echo ==============================================
echo.
echo 正在啟動伺服器...
echo (請先確保您已經在 .env.local 檔案中設定好 API 金鑰)
echo.

:: 延遲 3 秒後開啟瀏覽器
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: 啟動 Next.js 開發伺服器
npm run dev
pause
