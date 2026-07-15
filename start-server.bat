@echo off
cd /d "%~dp0"
if not exist index.html copy farsamo.html index.html

netstat -ano | findstr :8000 >nul
if errorlevel 1 (
  start "ILWAAD Server" cmd /k node server.js
)

timeout /t 2 /nobreak >nul
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://127.0.0.1:8000/
