#include ../json2.js
#include ../funcoes.jsx

function conteudos(conteudosJSON, instagram, id) {
	var docConteudo;

	function capa() {
		var grupoTitulo = docConteudo.layers.getByName('titulo');

		//Titulo 1 do Conteudo
		var tituloLinha1 = grupoTitulo.layers.getByName('titulo-linha-1');
		tituloLinha1.textItem.contents = conteudo.titulo[0];

		//Titulo 2 do Conteudo
		var tituloLinha2 = grupoTitulo.layers.getByName('titulo-linha-2');
		tituloLinha2.textItem.contents = conteudo.titulo[1];

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
		var posicao = conteudo.imagem.posicao;
		var girar = strToBool(conteudo.imagem.girar);
		var arquivoImg = decodeURI(File($.fileName).parent) + '/' + conteudo.dirBase + conteudo.imagem.nome;

		copiaParteImagemParaClipboard(arquivoImg, 1080, 1080, posicao, "H", girar);

		layerImagem = docConteudo.layers.getByName("imagem");
		app.activeDocument.activeLayer = layerImagem;
		app.activeDocument.activeLayer.visible = false;

		imgNova = docConteudo.paste();

		imgNova.translate(0,(layerImagem.bounds[1]-imgNova.bounds[1]));

		for (var a = 0; a < instagram.length; a++) {
			var sNomePerfil = instagram[a].nome_perfil;

			// Marca D'água
			var textoAssinatura = docConteudo.layers.getByName('assinatura');
			textoAssinatura.textItem.contents = sNomePerfil;

			//Salvar o conteudo
			saveJpeg(conteudo.dirExportar.replace("[ASSINATURA]",sNomePerfil), conteudo.prefixo);
		}
	}

	function processaConteudo(conteudo) {
		var strtRulerUnits = app.preferences.rulerUnits;
		var strtTypeUnits = app.preferences.typeUnits;

		var fileRef = new File(decodeURI(File($.fileName).parent) + '/' + conteudo.modelo);
		docConteudo = open(fileRef);

		capa();

		docConteudo.close(SaveOptions.DONOTSAVECHANGES);

		app.preferences.rulerUnits = strtRulerUnits; 
		app.preferences.typeUnits = strtTypeUnits;
	}

	log("Início da Exportação dos Conteúdos");

	var conteudos = loadJson(conteudosJSON);
	for (var j = 0; j < conteudos.length; j++) {
		var conteudo =conteudos[j];
		if ( (conteudo.titulo!=undefined) && (id == 0 || id == conteudo.id) ) {
			processaConteudo(conteudo);
		}
	}

	log("Fim da Exportação dos Conteúdos");
}