@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
set "PHP84=%LOCALAPPDATA%\Microsoft\WinGet\Packages\PHP.PHP.NTS.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"
if exist "%PHP84%" (
  "%PHP84%" "%SCRIPT_DIR%artisan" %*
  exit /b %ERRORLEVEL%
)
set "PHP83=%LOCALAPPDATA%\Microsoft\WinGet\Packages\PHP.PHP.NTS.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"
if exist "%PHP83%" (
  "%PHP83%" "%SCRIPT_DIR%artisan" %*
  exit /b %ERRORLEVEL%
)
where php >nul 2>&1
if %ERRORLEVEL% equ 0 (
  php "%SCRIPT_DIR%artisan" %*
  exit /b %ERRORLEVEL%
)
echo [ERROR] PHP not found. Install PHP 8.4 from winget or add php.exe to PATH.
echo   winget install PHP.PHP.NTS.8.4
exit /b 1
