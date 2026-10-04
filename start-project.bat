@echo off
echo Starting VELLIFE Backend and Frontend...

:: Start Backend in separate window
start "VELLIFE Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .\.venv\Scripts\python.exe main.py"

:: Start Frontend in separate window
start "VELLIFE Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait 3 seconds and open browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo VELLIFE is running at http://localhost:5173
pause
