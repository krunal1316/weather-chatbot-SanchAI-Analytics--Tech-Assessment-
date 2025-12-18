@echo off
cd /d "%~dp0backend"
call venv\Scripts\activate.bat
echo Starting backend server on http://localhost:8000
python -m uvicorn main:app --reload --port 8000
pause

