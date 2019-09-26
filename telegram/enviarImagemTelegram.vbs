photoURL = "https://perderbarrigadevez.com.br/ferramentas/Ordem Feed/mes-001/semana-1/5-sexta/P1-M0005.jpg"

photoURL = Wscript.Arguments(0)
if WScript.Arguments.Count = 0 then
    WScript.Echo "Missing parameters"
else
    WScript.Echo Wscript.Arguments(0)
	strChatId = "-1001476239804"
	APIcode = "868514560:AAEvTAsxe_FfrbYkkfz5Su6FvEcG-edBEoY"

	strPostData = "chat_id=" & strChatId & "&photo=" & photoURL

	Set objRequest = CreateObject("MSXML2.XMLHTTP")
	With objRequest
		.Open "POST", "https://api.telegram.org/bot" & APIcode & "/sendPhoto?", False
		.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"
		.send (strPostData)
		strResponse = .responseText
		' MsgBox strResponse
	End With
end if


' sAPI_ID = "868514560:AAEvTAsxe_FfrbYkkfz5Su6FvEcG-edBEoY"
' sChat_ID = "-1001476239804"
' sMSG = "Funcionou"
' photoURL = "https://i.imgur.com/0eH6d1v.gif" 'URL of photo

' 'URL to open....
' 'sUrl = "https://api.telegram.org/bot" & sAPI_ID & "/sendMessage"
' sUrl = "https://api.telegram.org/bot" & sAPI_ID & "/sendPhoto?"
' 'POST Request to send.
' 'sRequest = "text=" & sMSG & "&chat_id=" & sChat_ID
' sRequest = "chat_id=" & sChat_ID & "&photo=" & photoURL

' HTTPPost sUrl, sRequest

' Function HTTPPost(sUrl, sRequest)
	' set oHTTP = CreateObject("Microsoft.XMLHTTP")
	' oHTTP.open "POST", sUrl,false
	' oHTTP.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"
	' oHTTP.setRequestHeader "Content-Length", Len(sRequest)
	' oHTTP.send sRequest
	' sHTML = oHTTP.responseText
	' MsgBox sHTML
' End Function