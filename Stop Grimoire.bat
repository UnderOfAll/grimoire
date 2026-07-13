@echo off
REM Stop the hidden Grimoire server (frees port 8777).
set PORT=8777
set FOUND=

for /f "tokens=5" %%p in ('netstat -aon ^| findstr :%PORT% ^| findstr LISTENING') do (
  taskkill /f /pid %%p >nul 2>nul
  set FOUND=1
)

if defined FOUND (
  echo Grimoire server stopped.
) else (
  echo No Grimoire server was running on port %PORT%.
)
timeout /t 2 >nul
