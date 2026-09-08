@echo off
title XORON - Smart India Hackathon 2026 (SIH26003)
echo =====================================================================
echo  XORON: Cognitive Care in the Language of Home
echo  Smart India Hackathon 2026 | Problem Statement ID: SIH26003
echo  Team: Invincible Core
echo =====================================================================
echo.
echo Starting XORON local offline-first server on http://127.0.0.1:8000 ...
echo.
py -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload
pause
