@echo off
REM Run from BibleFun-main folder. Optional: deploy.bat 1.8.1 to set version then push.
powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" %*
