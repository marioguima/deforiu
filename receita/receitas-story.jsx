#include ../json2.js
#include ../funcoes.jsx

function receitas_story(receitasJSON, instagram, id) {
	var docReceita;

	function capa() {
		//Titulo 1 da receita
		var grupoTitulo = docReceita.layers.getByName('titulo');

		var tituloLinha1 = grupoTitulo.layers.getByName('titulo-linha-1');
		tituloLinha1.textItem.contents = receita.titulo[0];
		
		var tituloLinha1Width = tituloLinha1.bounds[2].value - tituloLinha1.bounds[0].value;
		
		var tituloLinha1Destaque = grupoTitulo.layers.getByName('titulo-linha-1-destaque');
		var newWidth = (tituloLinha1Width / (tituloLinha1Destaque.bounds[0]-tituloLinha1Destaque.bounds[2]));

		//Ajusta para o tamanho do texto
		tituloLinha1Destaque.resize(newWidth*100, 100, AnchorPosition.MIDDLECENTER);

		//Aumenta a largura em 110 pixel / 55 px para cada lado
		newWidth = (((tituloLinha1Width + 110) * 100) / tituloLinha1Width);
		tituloLinha1Destaque.resize(newWidth, 100, AnchorPosition.MIDDLECENTER);


		//Titulo 2 da receita
		var tituloLinha2 = grupoTitulo.layers.getByName('titulo-linha-2');
		tituloLinha2.textItem.contents = receita.titulo[1];
		var tituloLinha2Width = tituloLinha2.bounds[2].value - tituloLinha2.bounds[0].value;
		
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

		var tituloLinha2Destaque = grupoTitulo.layers.getByName('titulo-linha-2-destaque');
		newWidth = (tituloLinha2Width / (tituloLinha2Destaque.bounds[0]-tituloLinha2Destaque.bounds[2]));

		//Ajusta para o tamanho do texto
		tituloLinha2Destaque.resize(newWidth*100, 100, AnchorPosition.MIDDLECENTER);

		//Aumenta a largura em 160 pixel / 80 px para cada lado
		newWidth = (((tituloLinha2Width + 160) * 100) / tituloLinha2Width);
		tituloLinha2Destaque.resize(newWidth, 100, AnchorPosition.MIDDLECENTER);
		tituloLinha2Destaque.rotate(-5);

		//Imagem Destaque
		var posicao = receita.imagem.posicao;
		var girar = strToBool(receita.imagem.girar);
		var arquivoImg = decodeURI(File($.fileName).parent) + '/' + receita.dirBase + receita.imagem.nome;

		copiaParteImagemParaClipboard(arquivoImg, 1920, 1080, posicao, "H", girar);

		layerImagem = docReceita.layers.getByName("imagem");
		app.activeDocument.activeLayer = layerImagem;
		app.activeDocument.activeLayer.visible = false;

		imgNova = docReceita.paste();

		imgNova.translate(0,(layerImagem.bounds[1]-imgNova.bounds[1]));

		for (var a = 0; a < instagram.length; a++) {
			var sNomePerfil = instagram[a].nome_perfil;

			// Marca D'água
			var grupoMarcaDagua = docReceita.layers.getByName('marca-dagua');
			var textoNome = grupoMarcaDagua.layers.getByName('nome');
			textoNome.textItem.contents = sNomePerfil;
			var textoNomeWidth = textoNome.bounds[2].value - textoNome.bounds[0].value;
			
			var nomeDestaque = grupoMarcaDagua.layers.getByName('nome-destaque');
			newWidth = (textoNomeWidth / (nomeDestaque.bounds[0]-nomeDestaque.bounds[2]));
			
			//Ajusta para o tamanho do texto
			nomeDestaque.resize(newWidth*100, 100, AnchorPosition.MIDDLECENTER);
			
			//Aumenta a largura em 80 pixel / 40 px para cada lado
			newWidth = (((textoNomeWidth + 80) * 100) / textoNomeWidth);
			nomeDestaque.resize(newWidth, 100, AnchorPosition.MIDDLECENTER);

			//Salvar a capa
			saveJpeg(receita.dirExportar.replace("[ASSINATURA]",sNomePerfil), receita.prefixo);
		}
	}

	function processaReceita(receita) {
		var strtRulerUnits = app.preferences.rulerUnits;
		var strtTypeUnits = app.preferences.typeUnits;
		
		var fileRef = new File(decodeURI(File($.fileName).parent) + '/' + receita.modelo);
		docReceita = open(fileRef);

		capa();

		docReceita.close(SaveOptions.DONOTSAVECHANGES);

		app.preferences.rulerUnits = strtRulerUnits; 
		app.preferences.typeUnits = strtTypeUnits;
	}

	log("Início da Exportação das Receitas - Story");

	var receitas = loadJson(receitasJSON);
	for (var j = 0; j < receitas.length; j++) {
		var receita = receitas[j];
		if ( (receita.titulo!=undefined) && (id == 0 || id == receita.id) ) {
			processaReceita(receita);
		}
	}

	log("Fim da Exportação das Receitas - Story");
	
}