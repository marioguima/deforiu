Set oFs = CreateObject("Scripting.FilesystemObject")
Set oWsh = CreateObject("WScript.Shell")
SetClipboard "Hello Clipboard"
WScript.Echo GetClipboard()
WScript.Quit
Sub SetClipboard(sText)
	Dim sFile, oFile
	sFile = oWsh.ExpandEnvironmentStrings("%TEMP%")
	If sFile = "%TEMP%" Then sFile = "."
	sFile = sFile & "\~SetClipboard.hta"
	WScript.Echo sFile
	If Not oFs.FileExists(sFile) Then
		Set file = oFs.CreateTextFile(sFile, True)
		file.WriteLine ""
		file.Close : Set file = Nothing
	End If
	oWsh.Run sFile & " " & sText, 0, True
End Sub
Function GetClipboard()
	GetClipboard = CreateObject("htmlfile").ParentWindow.ClipboardData.GetData("text")
End Function

' set shell = CreateObject("WScript.Shell")
' shell.run"cmd.exe"
' WScript.Sleep 1000
' 'shell.SendKeys"{~}a{~}o"
' 'shell.SendKeys"{^}a{^}e{^}o{^}u"
' 'shell.SendKeys chr(180) & "a" & chr(180) & "e" & chr(180) & "i" & chr(180) & "o" & chr(180) & "u" & chr(231) & chr(199)
' 'shell.SendKeys "descri" & chr(231) & "{~}a" & "o"
' shell.SendKeys "cscript ""E:\Herbalife\Desafio do Emagrecimento Definitivo\Script - Photoshop\Instagram Coach\telegram\enviarMensagemTelegram.vbs"" ""descri" & chr(231) & "{~}a" & "o""" & ChrW("1F604") & "{ENTER}" 
' shell.SendKeys "exit{ENTER}"


' Set Inp = WScript.Stdin
' Set Outp = Wscript.Stdout
' Set cmd = CreateObject("Wscript.Shell").Exec("cmd")
' cmd.stdin.writeline "cscript ""E:\Herbalife\Desafio do Emagrecimento Definitivo\Script - Photoshop\Instagram Coach\telegram\enviarMensagemTelegram.vbs"" ""descrição"" "
' 'wscript.sleep 20000
' cmd.stdin.writeline "dir"
' cmd.stdin.writeline "exit"
' Do While Not cmd.stdout.AtEndOfStream 

    ' results = cmd.stdout.readall
    ' If err.number <> 0 then Exit Do
        ' wscript.echo results
' Loop


' Set oShell = WScript.CreateObject ("WScript.Shell")
' oShell.run "cmd.exe /C cscript ""E:\Herbalife\Desafio do Emagrecimento Definitivo\Script - Photoshop\Instagram Coach\telegram\enviarMensagemTelegram.vbs"" ""descrição"" "
' Set oShell = Nothing