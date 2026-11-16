@echo off
cd /d "%~dp0"
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_TRACING=1
echo Building Next.js application in %cd%
call "C:\Users\ak\AppData\Local\nvm\v20.19.0\npm.cmd" run build
