#include ../json2.js
#include ../funcoes.jsx

function marque(arquivoJSON, instagram, id) {
	var docPhotoshop;

	function capa() {
		var grupoTitulo = docPhotoshop.layers.getByName('titulo');

		//Titulo 1 do Marque
		var tituloLinha1 = grupoTitulo.layers.getByName('titulo-linha-1');
		tituloLinha1.textItem.contents = marque.titulo[0];

		var tituloHeight = getRealTextLayerDimensions(tituloLinha1).height;
		// var precisaAjustar = tituloHeight > 185;
		var tituloSize = 140;
		while (tituloHeight > 185) {
			tituloSize -= 5;
			tituloLinha1.textItem.size = new UnitValue(tituloSize, "px");
			tituloHeight = getRealTextLayerDimensions(tituloLinha1).height;
		}
		// if (precisaAjustar) {
		// 	tituloLinha1.textItem.size = new UnitValue(tituloSize-10, "px");
		// }

		//Titulo 2 do Marque
		var tituloLinha2 = grupoTitulo.layers.getByName('titulo-linha-2');
		tituloLinha2.textItem.contents = marque.titulo[1];

		var tituloHeight = getRealTextLayerDimensions(tituloLinha2).height;
		// var precisaAjustar = tituloHeight > 84;
		var tituloSize = 85;
		while (tituloHeight > 84) {
			tituloSize -= 5;
			tituloLinha2.textItem.size = new UnitValue(tituloSize, "px");
			tituloHeight = getRealTextLayerDimensions(tituloLinha2).height;
		}
		// if (precisaAjustar) {
		// 	tituloLinha2.textItem.size = new UnitValue(tituloSize-10, "px");
		// }

		var tituloLinha2Width = tituloLinha2.bounds[2].value - tituloLinha2.bounds[0].value;
		
		var tituloLinha2Destaque = grupoTitulo.layers.getByName('titulo-linha-2-destaque');
		var newWidth = (tituloLinha2Width / (tituloLinha2Destaque.bounds[0]-tituloLinha2Destaque.bounds[2]));

		//Ajusta para o tamanho do texto
		tituloLinha2Destaque.resize(newWidth*100, 100, AnchorPosition.MIDDLECENTER);

		//Aumenta a largura em 80 pixel / 40 px para cada lado
		newWidth = (((tituloLinha2Width + 80) * 100) / tituloLinha2Width);
		tituloLinha2Destaque.resize(newWidth, 100, AnchorPosition.MIDDLECENTER);

		//Titulo 3 do Marque
		var tituloLinha3 = grupoTitulo.layers.getByName('titulo-linha-3');
		tituloLinha3.textItem.contents = marque.titulo[2];

		var tituloHeight = getRealTextLayerDimensions(tituloLinha3).height;
		// var precisaAjustar = tituloHeight > 146;
		var tituloSize = 180;
		while (tituloHeight > 146) {
			tituloSize -= 5;
			tituloLinha3.textItem.size = new UnitValue(tituloSize, "px");
			tituloHeight = getRealTextLayerDimensions(tituloLinha3).height;
		}
		// if (precisaAjustar) {
		// 	tituloLinha3.textItem.size = new UnitValue(tituloSize-10, "px");
		// }

		//Imagem Destaque
		var posicao = marque.imagem.posicao;
		var girar = strToBool(marque.imagem.girar);
		var arquivoImg = decodeURI(File($.fileName).parent) + '/' + marque.dirBase + marque.imagem.nome;

		copiaParteImagemParaClipboard(arquivoImg, 1080, 1080, posicao, "H", girar);

		layerImagem = docPhotoshop.layers.getByName("imagem");
		app.activeDocument.activeLayer = layerImagem;
		app.activeDocument.activeLayer.visible = false;

		imgNova = docPhotoshop.paste();

		imgNova.translate(0,(layerImagem.bounds[1]-imgNova.bounds[1]));

		for (var a = 0; a < instagram.length; a++) {
			var sNomePerfil = instagram[a].nome_perfil;

			// Marca D'água
			var textoAssinatura = docPhotoshop.layers.getByName('assinatura');
			textoAssinatura.textItem.contents = sNomePerfil;

			//Salvar o marque
			saveJpeg(marque.dirExportar.replace("[ASSINATURA]",sNomePerfil), marque.prefixo);
		}
	}

	function processaConteudo(marque) {
		var strtRulerUnits = app.preferences.rulerUnits;
		var strtTypeUnits = app.preferences.typeUnits;

		var fileRef = new File(decodeURI(File($.fileName).parent) + '/' + marque.modelo);
		docPhotoshop = open(fileRef);

		capa();

		docPhotoshop.close(SaveOptions.DONOTSAVECHANGES);

		app.preferences.rulerUnits = strtRulerUnits; 
		app.preferences.typeUnits = strtTypeUnits;
	}

	log("Início da Exportação das Marcações");

	var marcacoes = loadJson(arquivoJSON);
	for (var j = 0; j < marcacoes.length; j++) {
		var marque =marcacoes[j];
		if ( (marque.titulo!=undefined) && (id == 0 || id == marque.id) ) {
			processaConteudo(marque);
		}
	}

	log("Fim da Exportação das Marcações");
}