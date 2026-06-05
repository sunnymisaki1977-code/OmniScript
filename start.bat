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


start "" "http://localhost:3000"

echo Running dev server...
npm run dev

pause
