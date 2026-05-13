@echo off
cd /d A:\VScode\traffic-incidents-map-project
start "DB Server" cmd /k "cd /d A:\VScode\traffic-incidents-map-project && npm run server"
timeout /t 2 /nobreak >nul
start "Frontend Dev" cmd /k "cd /d A:\VScode\traffic-incidents-map-project && npm run dev"
start "Frontend Dev Admin" cmd /k "cd /d A:\VScode\traffic-incidents-map-project && npm run dev:admin"

@REM устал сворачивать окна при каждом запуске
@REM автоматизирую
@REM попробую nircmd.exe
@REM  https://www.nirsoft.net/utils/nircmd.html
timeout /t 3 /nobreak >nul
A:\VScode\traffic-incidents-map-project\nircmd.exe win min stitle "DB Server"
A:\VScode\traffic-incidents-map-project\nircmd.exe win min stitle "Frontend Dev"
A:\VScode\traffic-incidents-map-project\nircmd.exe win min stitle "Frontend Dev Admin"

timeout /t 5 /nobreak >nul
start "" http://localhost:5173/






