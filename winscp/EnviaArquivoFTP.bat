@echo off

echo Starting WinSCP

REM %%1 E:\Herbalife\Desafio do Emagrecimento Definitivo\Script - Photoshop\Instagram Coach\export\MARIOGUIMARAESCOACH\mes-001\semana-1\5-sexta\
REM %%2 P1-M0005.jpg
REM %%3 mes-001/semana-1/5-sexta/

set LOCAL_PATH=%1
set FILE_NAME=%2
set REMOTE_PATH_BASE="ferramentas/Ordem Feed"
set REMOTE_PATH=%3

"C:\Program Files (x86)\WinSCP\WinSCP.com" /log="E:\Herbalife\Desafio do Emagrecimento Definitivo\Script - Photoshop\Instagram Coach\winscp.log" /ini=nul /command ^
 "open ftp://perderbarrigadevez%%40marioguimaraes.com.br:mcsg2408@br342.hostgator.com.br/" ^
 "cd "%REMOTE_PATH_BASE%"" ^
 "cd "%REMOTE_PATH%"" ^
 "exit"

@if %ERRORLEVEL% EQU 1 goto error
@if %ERRORLEVEL% EQU 0 goto ok

:ok
echo Path %REMOTE_PATH% exists
"C:\Program Files (x86)\WinSCP\WinSCP.com" /log="E:\Herbalife\Desafio do Emagrecimento Definitivo\Script - Photoshop\Instagram Coach\winscp.log" /ini=nul /command ^
 "open ftp://perderbarrigadevez%%40marioguimaraes.com.br:mcsg2408@br342.hostgator.com.br/" ^
 "cd "%REMOTE_PATH_BASE%"" ^
 "cd "%REMOTE_PATH%"" ^
 "lcd "%LOCAL_PATH%"" ^
 "put "%FILE_NAME%"" ^
 "exit"
exit /b 0

:error
echo Error or path %REMOTE_PATH% not exists
"C:\Program Files (x86)\WinSCP\WinSCP.com" /log="E:\Herbalife\Desafio do Emagrecimento Definitivo\Script - Photoshop\Instagram Coach\winscp.log" /ini=nul /command ^
 "open ftp://perderbarrigadevez%%40marioguimaraes.com.br:mcsg2408@br342.hostgator.com.br/" ^
 "cd "%REMOTE_PATH_BASE%"" ^
 "mkdir "%REMOTE_PATH%"" ^
 "cd "%REMOTE_PATH%"" ^
 "lcd "%LOCAL_PATH%"" ^
 "put "%FILE_NAME%"" ^
 "exit"
exit /b 1

:end

echo WinSCP finished