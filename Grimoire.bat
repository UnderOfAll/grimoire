@echo off
REM ── Grimoire launcher ─────────────────────────────────────────────
REM Serves the app over HTTP (needed because it loads JSON via fetch)
REM and opens it in your default browser. Close this window to stop.

cd /d "%~dp0"

set PORT=8777

REM Pick a Python launcher (py, then python, then python3).
set PY=
where py >nul 2>nul && set PY=py
if not defined PY where python >nul 2>nul && set PY=python
if not defined PY where python3 >nul 2>nul && set PY=python3

if not defined PY (
  echo Python was not found on PATH. Install Python 3 and try again.
  pause
  exit /b 1
)

echo Starting Grimoire on http://localhost:%PORT%
start "" "http://localhost:%PORT%/index.html"
%PY% scripts\serve.py %PORT%
