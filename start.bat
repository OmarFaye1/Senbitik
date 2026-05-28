@echo off
echo Demarrage de Natamansa...

:: Démarrer le backend dans une nouvelle fenêtre
start "Natamansa Backend" cmd /k "cd /d %~dp0backend && node server.js"

:: Attendre 2 secondes
timeout /t 2 /nobreak > nul

:: Démarrer le frontend dans une nouvelle fenêtre
start "Natamansa Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo Les deux serveurs sont en cours de demarrage...
echo Backend  : http://localhost:3001
echo Frontend : http://localhost:3000
echo.
pause
