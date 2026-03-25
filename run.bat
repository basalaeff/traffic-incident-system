@echo off
start "DB Server" cmd /k "cd /d A:\VScode\traffic-incident-system && npm run server"
timeout /t 2 /nobreak >nul
start "Frontend Dev" cmd /k "cd /d A:\VScode\traffic-incident-system && npm run dev"
timeout /t 5 /nobreak >nul
start "" http://localhost:5173/
exit
