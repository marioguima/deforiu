#include ../json2.js
#include ../funcoes.jsx

function motivacoes(motivacoesJSON, instagram, id) {
	var docMotivacao;

	function capa() {
		var grupoTitulo = docMotivacao.layers.getByName('titulo');

		//Titulo 1 da Motivacao
		var tituloLinha1 = grupoTitulo.layers.getByName('titulo-linha-1');
		tituloLinha1.textItem.contents = motivacao.titulo[0];

		//Titulo 2 da Motivacao
		var tituloLinha2 = grupoTitulo.layers.getByName('titulo-linha-2');
		tituloLinha2.textItem.contents = motivacao.titulo[1];

		var tituloHeight = getRealTextLayerDimensions(tituloLinha2).height;
		var precisaAjustar = tituloHeight > 330;
		var tituloSize = 200;
		while (tituloHeight > 330) {
			tituloSize -= 5;
			tituloLinha2.textItem.size = new UnitValue(tituloSize, "px");
			tituloHeight = getRealTextLayerDimensions(tituloLinha2).height;
		}
		if (precisaAjustar) {
			tituloLinha2.textItem.size = new UnitValue(tituloSize-10, "px");
		}
		
		//Imagem Destaque
		var posicao = motivacao.imagem.posicao;
		var girar = strToBool(motivacao.imagem.girar);
		var arquivoImg = decodeURI(File($.fileName).parent) + '/' + motivacao.dirBase + motivacao.imagem.nome;

		copiaParteImagemParaClipboard(arquivoImg, 1080, 1080, posicao, "H", girar);

		layerImagem = docMotivacao.layers.getByName("imagem");
		app.activeDocument.activeLayer = layerImagem;
		app.activeDocument.activeLayer.visible = false;

		imgNova = docMotivacao.paste();

		imgNova.translate(0,(layerImagem.bounds[1]-imgNova.bounds[1]));

		for (var a = 0; a < instagram.length; a++) {
			var sNomePerfil = instagram[a].nome_perfil;

			// Marca D'água
			var textoAssinatura = docMotivacao.layers.getByName('assinatura');
			textoAssinatura.textItem.contents = sNomePerfil;

			//Salvar a motivacao
			saveJpeg(motivacao.dirExportar.replace("[ASSINATURA]",sNomePerfil), motivacao.prefixo);
		}
	}

	function processaMotivacao(motivacao) {
		var strtRulerUnits = app.preferences.rulerUnits;
		var strtTypeUnits = app.preferences.typeUnits;
		
		var fileRef = new File(decodeURI(File($.fileName).parent) + '/' + motivacao.modelo);
		docMotivacao = open(fileRef);

		capa();

		docMotivacao.close(SaveOptions.DONOTSAVECHANGES);

		app.preferences.rulerUnits = strtRulerUnits; 
		app.preferences.typeUnits = strtTypeUnits;
	}

	log("Início da Exportação das Motivações");
	
	var motivacoes = loadJson(motivacoesJSON);
	for (var j = 0; j < motivacoes.length; j++) {
		var motivacao = motivacoes[j];
		if ( (motivacao.titulo!=undefined) && (id == 0 || id == motivacao.id) ) {
			processaMotivacao(motivacao);
		}
	}

	log("Fim da Exportação das Motivações");
	
}