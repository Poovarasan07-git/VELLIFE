# VELLIFE One-Click Launcher
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\backend'; & '.\.venv\Scripts\python.exe' main.py" -WindowStyle Normal

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\frontend'; npm run dev" -WindowStyle Normal

# Open Browser
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
