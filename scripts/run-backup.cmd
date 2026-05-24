@echo off
REM Wrapper used by Windows Task Scheduler. Don't rename without updating the task.
cd /d "%~dp0\.."
"C:\Program Files\nodejs\node.exe" "scripts\backup-db.mjs" >> "D:\SharonBackups\backup.log" 2>&1
