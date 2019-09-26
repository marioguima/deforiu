if (String.prototype.trim == null) String.prototype.trim = function () {return this.replace(/(^[\s\n\r\t\x0B]+)|([\s\n\r\t\x0B]+$)/g, '')};

function loadJson(relPath) {
	var script = new File($.fileName);
	var jsonFile = new File(script.path + '/' + relPath);

	jsonFile.open('r');
	var str = jsonFile.read();
	jsonFile.close();

	return JSON.parse(str);
}

function makeSelection(x,y,sw,sh){
	app.activeDocument.selection.select([ [x,y], [x,y+sh], [x+sw,y+sh], [x+sw,y] ]);
}

function mkdir(path) {
  var folder = new Folder(path);
  if (!folder.exists) {
    var parts = path.split('/');
    parts.pop();
    mkdir(parts.join('/'));
    folder.create();
  }
}

function saveJpeg(caminho, nome) {
	var script = new File($.fileName);
	var file = new File(script.path + caminho + nome + '.jpg');
	var doc = app.activeDocument;
//	var file = new File(doc.path + name + '.jpg');
	var opts = new JPEGSaveOptions();
	opts.quality = 10;
	
	//verifica se o caminho existe, senão, cria
	mkdir(script.path + caminho);
	
	//salva a imagem
	doc.saveAs(file, opts, true);
}

function getRealTextLayerDimensions(textLayer) {
    var textLayerCopy = textLayer.duplicate(activeDocument, ElementPlacement.INSIDE);

    textLayerCopy.textItem.height = activeDocument.height;

    textLayerCopy.rasterize(RasterizeType.TEXTCONTENTS);

    var dimensions = getLayerDimensions(textLayerCopy);

    textLayerCopy.remove();

    return dimensions;
}

function getLayerDimensions(layer) {
    return { 
        width: layer.bounds[2] - layer.bounds[0],
        height: layer.bounds[3] - layer.bounds[1]
    };
}

function flipLayer(direction) {
	switch (direction.toLowerCase()){
		case 'h' : direction = 'Hrzn'; break;
		case 'v' : direction = 'Vrtc'; break;
		default : return;
		}
		var desc23 = new ActionDescriptor();
		desc23.putEnumerated( charIDToTypeID('Axis'), charIDToTypeID('Ornt'), charIDToTypeID(direction) );
	 try{
		executeAction( charIDToTypeID('Flip'), desc23, DialogModes.NO );
	 }catch(e){}
};

// posicao E - Esquerda / C - Centro / D - Direita / CE - Centro para Esquerda/ CD Centro para Direita / T - Topo / F - Fundo
// direcao V = variação vertical / H = variação horizontal
// girar true / false
function copiaParteImagemParaClipboard(arquivo,altura,largura,posicao,direcao,girar) {
	direcao = direcao.toUpperCase();
	posicao = posicao.toUpperCase();

	//Imagem Destaque
	var fileRef = new File(arquivo);
	var docImg = open(fileRef);

	if (direcao=="V") {
		//Largura
		docImg.resizeImage(UnitValue(largura,"px"),null,null,ResampleMethod.AUTOMATIC);
	}
	else {
		//Altura
		docImg.resizeImage(null,UnitValue(altura,"px"),null,ResampleMethod.AUTOMATIC);
	}

	//Duplica o layer para fazer o Flip
	if (girar) {
		//criando uma outra camada para poder toracionar o layer
		var x = 0;
		var y = 0;
		var sw = docImg.width;
		var sh = docImg.height;
		makeSelection(x,y,sw,sh);
		docImg.selection.copy();
		docImg.paste();

		flipLayer('h')
	}

	//Posicao C - Centro
	var x = (docImg.width-largura)/2;
	var y = (docImg.height-altura)/2;
	
 	if (posicao=="E" || posicao=="T") {
		x = 0;
		y = 0;
	}
	else if (posicao=="D") {
		x = docImg.width - largura;
		y = 0;
	}
	else if (posicao=="CE") {
		x = x - (largura/2);
		y = 0;
	}
	else if (posicao=="CD") {
		x = x + (largura/2);
		y = 0;
	}
	else if (posicao=="F") {
		x = 0;
		y = docImg.height - altura;
	}

	var sw = largura;
	var sh = altura;
	makeSelection(x,y,sw,sh);

	docImg.selection.copy();
	docImg.close(SaveOptions.DONOTSAVECHANGES);
}

// posicao 1,4,7,10,13,16,19,22... centro / topo
// posicao 2,5,8,11,14,17,20,23... direita / meio
// posicao 3,6,9,12,15,18,21,24... esquerda / fundo
// direcao V = variação vertical / H = variação horizontal
// girar true / false
function copiaParteImagemParaClipboard_OLD(arquivo,altura,largura,posicao,direcao,girar) {
	direcao = direcao.toUpperCase();

	//Imagem Destaque
	var fileRef = new File(arquivo);
	var docImg = open(fileRef);

	if (direcao=="V") {
		//Largura
		docImg.resizeImage(UnitValue(largura,"px"),null,null,ResampleMethod.AUTOMATIC);
	}
	else {
		//Altura
		docImg.resizeImage(null,UnitValue(altura,"px"),null,ResampleMethod.AUTOMATIC);
	}

	//Flip horizontal
	if (girar) {
		//criando uma outra camada para poder toracionar o layer
		var x = 0;
		var y = 0;
		var sw = docImg.width;
		var sh = docImg.height;
		makeSelection(x,y,sw,sh);
		docImg.selection.copy();
		docImg.paste();

		flipLayer('h')
	}

	var x = (docImg.width-largura)/2;
	var y = (docImg.height-altura)/2;

	//Ajusta a posição Top Left (x)
	if (posicao == 2 || posicao == 5 || posicao == 8 || posicao == 11 || posicao == 14 || posicao == 17 || posicao == 20 || posicao == 23) {
		if (direcao=="H") {
			x = x + largura;
			if ((x + largura) > docImg.width) {
				x = docImg.width - largura;
			}
		}
		else if (direcao=="V") {
			y = y + altura;
			if ((y + altura) > docImg.height) {
				y = docImg.height - altura;
			}
		}
	} else if  (posicao == 3 || posicao == 6 || posicao == 9 || posicao == 12 || posicao == 15 || posicao == 18 || posicao == 21 || posicao == 24) {
		if (direcao=="H") {
			x = x - largura;
			if (x < 0) {
				x = 0;
			}
		}
		else if (direcao=="V") {
			y = y - altura;
			if (y < 0) {
				y = 0;
			}
		}
	} 
	var sw = largura;
	var sh = altura;
	makeSelection(x,y,sw,sh);
	docImg.selection.copy();
	docImg.close(SaveOptions.DONOTSAVECHANGES);
}

/*
 * Converts a string to a bool.
 *
 * This conversion will:
 *
 *  - match 'true', 'on', or '1' as true.
 *  - ignore all white-space padding
 *  - ignore capitalization (case).
 *
 * '  tRue  ','ON', and '1   ' will all evaluate as true.
 *
 */
function strToBool(s)
{
	s = s.toLowerCase();
    // will match one and only one of the string 'true','1', or 'on' rerardless
    // of capitalization and regardless off surrounding white-space.
    //
    regex=/^\s*(y|s|true|1|on)\s*$/i

    return regex.test(s);
}

/* =======================================================
 * Saves file as text. Overwrites old file if exists.
 * Returns empty string if no errors, otherwise error message.
 * mode: a = Append / w = Write
 * =======================================================*/
function saveAsTextFile(filePath, content, mode) {
    var saveFile = new File(filePath);
	
    saveFile.encoding = "UTF8";
    saveFile.open(mode);
    if (saveFile.error != "")
        return saveFile.error;

    saveFile.write(content);
    if (saveFile.error != "")
        return saveFile.error;

    saveFile.close();
    if (saveFile.error != "")
        return saveFile.error;

    return "";
}

function timeStamp(formato){
	// Get the time and format it
	var digital = new Date();
	var hours = digital.getHours();
	var minutes = digital.getMinutes();
	var seconds = digital.getSeconds();
	//var amOrPm = "AM";
	//if (hours > 11) amOrPm = "PM";
	//if (hours > 12) hours = hours - 12;
	//if (hours == 0) hours = 12;
	if (hours <= 9) hours = "0" + hours;
	if (minutes <= 9) minutes = "0" + minutes;
	if (seconds <= 9) seconds = "0" + seconds;

	// Get the date and format it
	var date = new Date();
	var d = date.getDate();
	var day = (d < 10) ? '0' + d : d;
	var m = date.getMonth() + 1;
	var month = (m < 10) ? '0' + m : m;
	var yy = date.getYear();
	var year = (yy < 1000) ? yy + 1900 : yy;

	// create a variable with the fully formatted the time and date
	if(formato==1) {
		todaysDate = hours + ":" + minutes + ":" + seconds + " - " + day + "/" + month + "/" + year;
//		todaysDate = hours + ":" + minutes + ":" + seconds + " " + amOrPm + " - " + day + "/" + month + "/" + year;
	}
	else if(formato==2) {
		todaysDate = year + "-" + day + "-" + month + " " + hours + ":" + minutes + ":" + seconds;
	}

	// todaysDate = hours + ":" + minutes + ":" + seconds + " " + amOrPm + " - " + month + "/" + day + "/" + year;

	//MonthNames = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro");

	//todaysDate = hours + ":" + minutes + ":" + seconds + " " + amOrPm + " " + MonthNames[date.getMonth()] + " " + day + ", " + year;

	return todaysDate;
}

function log(texto) {
	var script = new File($.fileName);
	mkdir(script.path + '/export');
	saveAsTextFile(script.path + '/export/export.log', timeStamp(1) + ': ' + texto + '\r', 'a');
}


/**
 * RANDOM STRING GENERATOR
 *
 * Info:      http://stackoverflow.com/a/27872144/383904
 * Use:       randomString(length [,"A"] [,"N"] );
 * Default:   return a random alpha-numeric string
 * Arguments: If you use the optional "A", "N" flags:
 *            "A" (Alpha flag)   return random a-Z string
 *            "N" (Numeric flag) return random 0-9 string
 *
 * Examples:
 * randomString(10);        // "4Z8iNQag9v"
 * randomString(10, "A");   // "aUkZuHNcWw"
 * randomString(10, "N");   // "9055739230"
 */
function randomString(len, an){
    an = an&&an.toLowerCase();
    var str="", i=0, min=an=="a"?10:0, max=an=="n"?10:62;
    for(;i++<len;){
      var r = Math.random()*(max-min)+min <<0;
      str += String.fromCharCode(r+=r>9?(r<36?55:61):48);
    }
    return str;
}

function escreveTexto(sTexto, objTexto, alturaMaxima) {
	objTexto.textItem.contents = sTexto;
	var textoHeight = getRealTextLayerDimensions(objTexto).height;
	if(textoHeight > alturaMaxima) {
		var aPalavras = sTexto.split(" ");
		nPalavras = aPalavras.length;
		while (textoHeight > alturaMaxima) {
			objTexto.textItem.contents = "";
			nPalavras--;
			var sTmp = "";
			for (var n = 0; n < nPalavras; n++) {
				sTmp += aPalavras[n];
				if(n < nPalavras) {
					sTmp += " ";
				}
			}
			objTexto.textItem.contents = sTmp;
			textoHeight = getRealTextLayerDimensions(objTexto).height;
		}

		sTexto = "";
		for (var x = nPalavras; x < aPalavras.length; x++) {
			sTexto += aPalavras[x];
			if(x < aPalavras.length) {
				sTexto += " ";
			}
		}
	}
	else {
		objTexto.textItem.contents = "";
		objTexto.textItem.contents = sTexto;
		sTexto = "";
	}
	
	return sTexto;
}
