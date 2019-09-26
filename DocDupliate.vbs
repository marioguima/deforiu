Set app = CreateObject("Photoshop.Application")
Set d = app.Documents.Add
Set l1 = d.ArtLayers.Add
Set l2 = d.ArtLayers.Add
l2.Visible = false
Set d2 = d.Duplicate
Set d3 = d.Duplicate("foo")
Set d4 = d.Duplicate("foo", true)