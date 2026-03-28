@echo off
@REM кажется это звуки системы для сворачивания окна. Убиваем
taskkill /F /IM HWEAudioSession.exe 2>nul
cd /d A:\VScode\traffic-incident-system
start "DB Server" cmd /k "cd /d A:\VScode\traffic-incident-system && npm run server"
timeout /t 2 /nobreak >nul
start "Frontend Dev" cmd /k "cd /d A:\VScode\traffic-incident-system && npm run dev"
@REM устал сворачивать окна при каждом запуске
@REM автоматизирую
@REM попробую nircmd.exe
@REM  https://www.nirsoft.net/utils/nircmd.html
timeout /t 3 /nobreak >nul
A:\VScode\traffic-incident-system\nircmd.exe win min class "ConsoleWindowClass"
timeout /t 2 /nobreak >nul
start "" http://localhost:5173/
taskkill /F /IM HWEAudioSession.exe 2>nul





