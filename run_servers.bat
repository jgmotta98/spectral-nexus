@echo off
REM Save this script as start_servers.bat in the root of your project directory

REM Change to the directory containing your FastAPI app
cd /d "%~dp0\api\src"

REM Activate the virtual environment
call .venv\Scripts\activate

REM Start the FastAPI server
start cmd /k "uvicorn app:app --reload"

REM Wait a few seconds to ensure FastAPI server starts first
timeout /t 5 /nobreak

REM Change to the directory containing your npm project
cd /d "%~dp0\frontend"

REM Start the npm server
start cmd /k "npm run dev"

REM Pause to keep the command window open
pause
