@echo off
title ABHISHINDE PHOTOGRAPHY - Dev Server
echo ========================================================
echo  ABHISHINDE PHOTOGRAPHY - WE MAKE CINE STORIES
echo  Starting Next.js Dev Server on Port 3000...
echo ========================================================
cd /d "%~dp0frontend"
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_TRACING=1

where npm >nul 2>nul
if %errorlevel% equ 0 (
  npm run dev
) else (
  "C:\Users\ak\AppData\Local\nvm\v20.19.0\npm.cmd" run dev
)
pause
