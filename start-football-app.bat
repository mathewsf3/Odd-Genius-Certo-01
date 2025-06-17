@echo off
echo.
echo ========================================
echo   ⚽ Football Analytics Platform
echo ========================================
echo.
echo Starting both Backend and Enhanced Frontend...
echo.

echo 🔧 Starting Backend Server (Port 3000)...
start "Backend Server" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo 🎨 Starting Enhanced Frontend (Port 3001)...
start "Enhanced Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting!
echo.
echo 📍 Backend API: http://localhost:3000
echo 📍 Enhanced Frontend: http://localhost:3001
echo.
echo Press any key to exit...
pause >nul
