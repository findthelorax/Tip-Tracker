@echo off
setlocal

set "backendDirectory=C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend"
set "frontendDirectory=C:\Users\findt\Desktop\Coding\React\Tip-Tracker\frontend"
set "projectDirectory=C:\Users\findt\Desktop\Coding\React\Tip-Tracker"

echo Deleting node_modules folder and package-lock.json in backend...
rmdir /s /q "%backendDirectory%\node_modules" 2>nul
del /q "%backendDirectory%\package-lock.json" 2>nul

echo Deleting node_modules folder and package-lock.json in frontend...
rmdir /s /q "%frontendDirectory%\node_modules" 2>nul
del /q "%frontendDirectory%\package-lock.json" 2>nul

echo Running npm install in backend...
cd "%backendDirectory%"
call npm install

echo Running npm install in frontend...
cd "%frontendDirectory%"
call npm install

echo Going up one level to project directory...
cd "%projectDirectory%"

echo Opening VS Code in project directory...
code .

echo Script complete.

endlocal
