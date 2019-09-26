#include ../json2.js
#include ../funcoes.jsx

function dicas(dicasJSON, instagram, id) {
	var docDica;
	var nPagina = 1;

	function capa() {
		var grupoCapa = docDica.layerSets.getByName('capa');
		grupoCapa.visible = true;

		//Titulo 1 da dica
		var grupoTitulo = grupoCapa.layers.getByName('titulo');

		var tituloLinha1 = grupoTitulo.layers.getByName('titulo-linha-1');
		tituloLinha1.textItem.contents = dica.titulo[0];
		
		var tituloLinha1Width = tituloLinha1.bounds[2].value - tituloLinha1.bounds[0].value;
		
		var tituloLinha1Destaque = grupoTitulo.layers.getByName('titulo-linha-1-destaque');
		var newWidth = (tituloLinha1Width / (tituloLinha1Destaque.bounds[0]-tituloLinha1Destaque.bounds[2]));

		//Ajusta para o tamanho do texto
		tituloLinha1Destaque.resize(newWidth*100, 100, AnchorPosition.MIDDLECENTER);

		//Aumenta a largura em 110 pixel / 55 px para cada lado
		newWidth = (((tituloLinha1Width + 110) * 100) / tituloLinha1Width);
		tituloLinha1Destaque.resize(newWidth, 100, AnchorPosition.MIDDLECENTER);


		//Titulo 2 da dica
		var tituloLinha2 = grupoTitulo.layers.getByName('titulo-linha-2');
		tituloLinha2.textItem.contents = dica.titulo[1];
		var tituloLinha2Width = tituloLinha2.bounds[2].value - tituloLinha2.bounds[0].value;
		
		var tituloLinha2Destaque = grupoTitulo.layers.getByName('titulo-linha-2-destaque');
		newWidth = (tituloLinha2Width / (tituloLinha2Destaque.bounds[0]-tituloLinha2Destaque.bounds[2]));

		//Ajusta para o tamanho do texto
		tituloLinha2Destaque.resize(newWidth*100, 100, AnchorPosition.MIDDLECENTER);

		//Aumenta a largura em 160 pixel / 80 px para cada lado
		newWidth = (((tituloLinha2Width + 160) * 100) / tituloLinha2Width);
		tituloLinha2Destaque.resize(newWidth, 100, AnchorPosition.MIDDLECENTER);
		tituloLinha2Destaque.rotate(-5);

		
		//Episódio
		var grupoEpisodio = grupoCapa.layers.getByName('episodio');
		grupoEpisodio.visible = (dica.episodio != "0");
		if (grupoEpisodio.visible) {
			var textoEpisodio = grupoEpisodio.layers.getByName('titulo');
			textoEpisodio.textItem.contents = 'EPISÓDIO ' + dica.episodio;
			var textoEpisodioWidth = textoEpisodio.bounds[2].value - textoEpisodio.bounds[0].value;
			
			var textoEpisodioDestaque = grupoEpisodio.layers.getByName('destaque');
			newWidth = (textoEpisodioWidth / (textoEpisodioDestaque.bounds[0]-textoEpisodioDestaque.bounds[2]));

			//Ajusta para o tamanho do texto
			textoEpisodioDestaque.resize(newWidth*100, 100, AnchorPosition.MIDDLECENTER);

			//Aumenta a largura em 70 pixel / 35 px para cada lado
			newWidth = (((textoEpisodioWidth + 70) * 100) / textoEpisodioWidth);
			textoEpisodioDestaque.resize(newWidth, 100, AnchorPosition.MIDDLECENTER);
		}

		//Imagem Destaque
		var posicao = dica.imagem.posicao;
		var girar = strToBool(dica.imagem.girar);
		var arquivoImg = decodeURI(File($.fileName).parent) + '/' + dica.dirBase + dica.imagem.nome;

		copiaParteImagemParaClipboard(arquivoImg, 1080, 1080, posicao, "H", girar);

		layerImagem = grupoCapa.layers.getByName("imagem");
		app.activeDocument.activeLayer = layerImagem;
		app.activeDocument.activeLayer.visible = false;

		imgNova = docDica.paste();

		imgNova.translate(0,(layerImagem.bounds[1]-imgNova.bounds[1]));

		for (var a = 0; a < instagram.length; a++) {
			var sNomePerfil = instagram[a].nome_perfil;

			// Marca D'água
			var grupoMarcaDagua = grupoCapa.layers.getByName('marca-dagua');
			var textoNome = grupoMarcaDagua.layers.getByName('nome');
			textoNome.textItem.contents = sNomePerfil;
			var textoNomeWidth = textoNome.bounds[2].value - textoNome.bounds[0].value;
			
			var nomeDestaque = grupoMarcaDagua.layers.getByName('destaque');
			newWidth = (textoNomeWidth / (nomeDestaque.bounds[0]-nomeDestaque.bounds[2]));
			
			//Ajusta para o tamanho do texto
			nomeDestaque.resize(newWidth*100, 100, AnchorPosition.MIDDLECENTER);
			
			//Aumenta a largura em 80 pixel / 40 px para cada lado
			newWidth = (((textoNomeWidth + 80) * 100) / textoNomeWidth);
			nomeDestaque.resize(newWidth, 100, AnchorPosition.MIDDLECENTER);

			//Salvar a capa
			saveJpeg(dica.dirExportar.replace("[ASSINATURA]",sNomePerfil), dica.prefixo + nPagina);
		}

		grupoCapa.visible = false;
	}

	function conteudo() {
		function salvarImagem() {
			var posicao = item.imagem.posicao;
			var girar = strToBool(item.imagem.girar);
			var arquivoImg = decodeURI(File($.fileName).parent) + '/' + dica.dirBase + item.imagem.nome;

			copiaParteImagemParaClipboard(arquivoImg, 330, 1080, posicao, "V", girar);

			layerImagem = grupoConteudo.layers.getByName("imagem");
			app.activeDocument.activeLayer = layerImagem;
			app.activeDocument.activeLayer.visible = false;

			imgNova = docDica.paste();

			imgNova.translate(0,(layerImagem.bounds[1]-imgNova.bounds[1]));

			for (var a = 0; a < instagram.length; a++) {
				var sNomePerfil = instagram[a].nome_perfil;

				// Marca D'água
				var textoAssinatura = grupoConteudo.layers.getByName('assinatura');
				textoAssinatura.textItem.contents = sNomePerfil;

				//Salvar a dica
				saveJpeg(dica.dirExportar.replace("[ASSINATURA]",sNomePerfil), dica.prefixo + nPagina);
			}

			imgNova.remove();
		}

		var grupoConteudo = docDica.layerSets.getByName('conteudo');
		grupoConteudo.visible = true;

		//Arraste para continuar
		var grupoDica = grupoConteudo.layers.getByName('dica');
		grupoDica.visible = true;

		var layerTitulo = grupoConteudo.layers.getByName('titulo');

		//Texto da dica
		var textoDica = grupoConteudo.layers.getByName('texto');
		textoDica.textItem.contents = "";

		var palavrasOld;

		for (var i = 0; i < dica.itens.length; i++) {
			var item = dica.itens[i];
			layerTitulo.textItem.contents = item.titulo;

			var sTexto = item.texto;
			//trocar \n por \r (o \r é a quebra de linha no parágrafo no photoshop)
			sTexto = sTexto.replace(new RegExp("\n", 'g'), "\r");

			while (sTexto.length>0) {
				sTexto = escreveTexto(sTexto, textoDica, 450);
			
				nPagina++;
				
				if (i == (dica.itens.length-1)) {
					grupoDica.visible = false;
				}

				//Carrega a imagem de destaque da dica e salva a imagem
				salvarImagem();
			}
		}

		grupoConteudo.visible = false;
	}

	function processaDica(dica) {
		var strtRulerUnits = app.preferences.rulerUnits;
		var strtTypeUnits = app.preferences.typeUnits;

		nPagina = 1;
		
		var fileRef = new File(decodeURI(File($.fileName).parent) + '/' + dica.modelo);
		docDica = open(fileRef);

		//tornando invisivel todos os grupos
		for (var i = 0; i < docDica.layerSets.length; i++) {
			docDica.layerSets[i].visible = false;
		}

		capa();
		conteudo();

		docDica.close(SaveOptions.DONOTSAVECHANGES);

		app.preferences.rulerUnits = strtRulerUnits; 
		app.preferences.typeUnits = strtTypeUnits;
	}

	log("Início da Exportação das Dicas");
	
	var dicas = loadJson(dicasJSON);
	for (var j = 0; j < dicas.length; j++) {
		var dica = dicas[j];
		if ( (dica.titulo!=undefined) && (id == 0 || id == dica.id) ) {
			processaDica(dica);
		}
	}

	log("Fim da Exportação das Dicas");
}