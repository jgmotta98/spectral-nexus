@echo off
cd /d "%~dp0\api\src"
call .venv\Scripts\activate
start cmd /k "uvicorn app:app --reload"
timeout /t 5 /nobreak
cd /d "%~dp0"
start cmd /k "npm run dev"
pause