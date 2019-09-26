#include ../json2.js
#include ../funcoes.jsx

function resultados(resultadosJSON, instagram, id) {
	var docResultado;
	var nPagina = 1;
	var imagemBase;
	var nLayout = 1;

	function capa() {
		//Imagem Destaque
		var posicao = resultado.imagem.posicao;
		var girar = strToBool(resultado.imagem.girar);
		var arquivoImg = decodeURI(File($.fileName).parent) + '/' + resultado.dirBase + resultado.imagem.nome;

		copiaParteImagemParaClipboard(arquivoImg, 1080, 1080, posicao, "H", girar);

		layerImagem = docResultado.layers.getByName("imagem");
		app.activeDocument.activeLayer = layerImagem;
		app.activeDocument.activeLayer.visible = false;

		imgNova = docResultado.paste();

		imgNova.translate(0,(layerImagem.bounds[1]-imgNova.bounds[1]));

		for (var a = 0; a < instagram.length; a++) {
			var sNomePerfil = instagram[a].nome_perfil;

			// Marca D'água
			var grupoMarcaDagua = docResultado.layers.getByName('marca-dagua');
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
			saveJpeg(resultado.dirExportar.replace("[ASSINATURA]",sNomePerfil), resultado.prefixo + nPagina);
		}		
	}

	function processaResultado(resultado) {
		var strtRulerUnits = app.preferences.rulerUnits;
		var strtTypeUnits = app.preferences.typeUnits;

		var fileRef = new File(decodeURI(File($.fileName).parent) + '/' + resultado.modelo);
		docResultado = open(fileRef);
		
		capa();

		docResultado.close(SaveOptions.DONOTSAVECHANGES);

		app.preferences.rulerUnits = strtRulerUnits; 
		app.preferences.typeUnits = strtTypeUnits;
	}

	log("Início da Exportação dos Resultados");
	
	var resultados = loadJson(resultadosJSON);
	for (var j = 0; j < resultados.length; j++) {
		var resultado = resultados[j];
		if (id == 0 || id == resultado.id) {
			processaResultado(resultado);
		}
	}

	log("Fim da Exportação dos Resultados");
}