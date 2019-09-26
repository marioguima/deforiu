dim appRef 
set appRef = CreateObject( "Photoshop.Application" )
appRef.doAction("FeedSemanal", "Scripts")
'appRef.ActiveDocument.Close()
'app.Quit()
'app = Nothing