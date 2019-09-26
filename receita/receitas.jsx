#include ../json2.js
#include ../funcoes.jsx

// [+] Aprendendo como trocar o texto
// [+] Como savar uma imagem JPEG
// [+] Como ler um arquivo JSON

function receitas(receitasJSON, instagram, id) {
	var docReceita;
	var nPagina = 1;
	var imagemBase;
	var nLayout = 1;

	function capa() {
		var grupoCapa = docReceita.layerSets.getByName('capa');
		grupoCapa.visible = true;

		//Titulo 1 da receita
		var grupoTitulo = grupoCapa.layers.getByName('titulo');

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

		copiaParteImagemParaClipboard(arquivoImg, 1080, 1080, posicao, "H", girar);

		layerImagem = grupoCapa.layers.getByName("imagem");
		app.activeDocument.activeLayer = layerImagem;
		app.activeDocument.activeLayer.visible = false;

		imgNova = docReceita.paste();

		imgNova.translate(0,(layerImagem.bounds[1]-imgNova.bounds[1]));


		for (var a = 0; a < instagram.length; a++) {
			var sNomePerfil = instagram[a].nome_perfil;

			// Marca D'água
			var grupoMarcaDagua = grupoCapa.layers.getByName('marca-dagua');
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
			saveJpeg(receita.dirExportar.replace("[ASSINATURA]",sNomePerfil), receita.prefixo + nPagina);
		}		

		grupoCapa.visible = false;
	}

	function salvarImagem(imagemBase,layerImagem,textoAssinatura) {
		var girar = (nPagina==4||nPagina==5||nPagina==8||nPagina==9);
		var posicao;

		if (nPagina%2 == 0) {
			posicao = "CE";
		}
		else {
			posicao = "CD";
		}

		//copiei 481 porque a imagem estava ficando borrada na borda
		copiaParteImagemParaClipboard(imagemBase, 1080, 481, posicao,"H",girar);

		app.activeDocument.activeLayer = layerImagem;
		app.activeDocument.activeLayer.visible = false;

		imgNova = docReceita.paste();
		//movo 1 pexel para esquerda, em relação a posição da imagem, porque a imagem está borrada na lateral quando copia
		imgNova.translate((layerImagem.bounds[0]-imgNova.bounds[0])-1,0);

		for (var a = 0; a < instagram.length; a++) {
			var sNomePerfil = instagram[a].nome_perfil;

			// Marca D'água
			textoAssinatura.textItem.contents = sNomePerfil;

			//Salvar os ingredientes
			saveJpeg(receita.dirExportar.replace("[ASSINATURA]",sNomePerfil), receita.prefixo + nPagina);
		}
		
		imgNova.remove();
	}

	function ingredientes(modelo) {
		function mudaLayout() {
			grupoIngredientes.visible = false;

			if(nLayout==1) {
				nLayout=2;
			}
			else {
				nLayout=1;
			}
			grupoIngredientes = docReceita.layerSets.getByName('ingredientes ' + nLayout);
			grupoIngredientes.visible = true;

			//Arraste para continuar
			grupoDica = grupoIngredientes.layers.getByName('dica');
			grupoDica.visible = true;

			// Marca D'água
			textoAssinatura = grupoIngredientes.layers.getByName('assinatura');

			//Lista de ingredientes
			textoListaItens = grupoIngredientes.layers.getByName('lista-itens');
		}

		var grupoIngredientes = docReceita.layerSets.getByName('ingredientes ' + nLayout);
		grupoIngredientes.visible = true;

		//Arraste para continuar
		var grupoDica = grupoIngredientes.layers.getByName('dica');
		grupoDica.visible = true;

		// Marca D'água
		var textoAssinatura = grupoIngredientes.layers.getByName('assinatura');

		//Lista de ingredientes
		var textoListaItens = grupoIngredientes.layers.getByName('lista-itens');

		var itensOld = "";

		var layerImagem;
		imagemBase = decodeURI(File($.fileName).parent) + '/' + receita.dirBase + receita.imgIngredientes;
		if (modelo == "simples") {
			textoListaItens.textItem.contents = "";
			for (var i = 0; i < receita.ingredientes.length; i++) {
				var ingrediente = receita.ingredientes[i];
				itensOld = textoListaItens.textItem.contents;

				if(textoListaItens.textItem.contents.length==1) {
					textoListaItens.textItem.contents = ingrediente
				}
				else {
					textoListaItens.textItem.contents += ingrediente;
				}

				listaHeight = getRealTextLayerDimensions(textoListaItens).height;
				if (listaHeight > 661) {
					textoListaItens.textItem.contents = itensOld;
					nPagina++;
					
					layerImagem = grupoIngredientes.layers.getByName("imagem");
					//Carrega a imagem de destaque dos ingredientes e salva a imagem
					salvarImagem(imagemBase,layerImagem,textoAssinatura);

					//Muda layout
					mudaLayout();

					textoListaItens.textItem.contents = "";
					textoListaItens.textItem.contents = ingrediente + '\r';
				}
				else {
					textoListaItens.textItem.contents += '\r';
				}
			}
			nPagina++;

			layerImagem = grupoIngredientes.layers.getByName("imagem");
			//Carrega a imagem de destaque dos ingredientes e salva a imagem
			salvarImagem(imagemBase,layerImagem,textoAssinatura);
			
			//Muda layout
			mudaLayout();
		}
		else {
			for (var i = 0; i < receita.ingredientes.length; i++) {
				var parte = receita.ingredientes[i];

				var layerSubTitulo = grupoIngredientes.layers.getByName('sub-titulo');
				layerSubTitulo.textItem.contents = parte.nome;

				textoListaItens.textItem.contents = "";

				for (var j = 0; j < parte.itens.length; j++) {
					var ingrediente = parte.itens[j];
					itensOld = textoListaItens.textItem.contents;

					if(textoListaItens.textItem.contents.length==1) {
						textoListaItens.textItem.contents = ingrediente
					}
					else {
						textoListaItens.textItem.contents += ingrediente;
					}

					listaHeight = getRealTextLayerDimensions(textoListaItens).height;
					if (listaHeight > 544) {
						textoListaItens.textItem.contents = itensOld;
						nPagina++;

						layerImagem = grupoIngredientes.layers.getByName("imagem");
						//Carrega a imagem de destaque dos ingredientes e salva a imagem
						salvarImagem(imagemBase,layerImagem,textoAssinatura);

						//Muda layout
						mudaLayout();

						var layerSubTitulo = grupoIngredientes.layers.getByName('sub-titulo');
						layerSubTitulo.textItem.contents = parte.nome;

						textoListaItens.textItem.contents = "";
						textoListaItens.textItem.contents = ingrediente + '\r';
					}
					else {
						textoListaItens.textItem.contents += '\r';
					}
				}
				nPagina++;

				layerImagem = grupoIngredientes.layers.getByName("imagem");
				//Carrega a imagem de destaque dos ingredientes e salva a imagem
				salvarImagem(imagemBase,layerImagem,textoAssinatura);
				
				//Muda layout
				mudaLayout();
			}
		}

		grupoIngredientes.visible = false;
	}

	function preparo(modelo) {
		function mudaLayout() {
			grupoPreparo.visible = false;

			if(nLayout==1) {
				nLayout=2;
			}
			else {
				nLayout=1;
			}
			grupoPreparo = docReceita.layerSets.getByName('preparo ' + nLayout);
			grupoPreparo.visible = true;

			//Arraste para continuar
			grupoDica = grupoPreparo.layers.getByName('dica');
			grupoDica.visible = true;

			// Marca D'água
			textoAssinatura = grupoPreparo.layers.getByName('assinatura');

			//Lista de passos
			textoPassoAPasso = grupoPreparo.layers.getByName('passo-a-passo');
		}

		var grupoPreparo = docReceita.layerSets.getByName('preparo ' + nLayout);
		grupoPreparo.visible = true;

		//Arraste para continuar
		var grupoDica = grupoPreparo.layers.getByName('dica');
		grupoDica.visible = true;

		// Marca D'água
		var textoAssinatura = grupoPreparo.layers.getByName('assinatura');

		//Passo a passo
		var textoPassoAPasso = grupoPreparo.layers.getByName('passo-a-passo');

		var itensOld = "";

		if (nPagina%2 > 0) {
			imagemBase = decodeURI(File($.fileName).parent) + '/' + receita.dirBase + receita.imgPreparo;
		}
		if (modelo == "simples") {
			textoPassoAPasso.textItem.contents = "";
			for (var i = 0; i < receita.preparo.length; i++) {
				var passo = receita.preparo[i];
				itensOld = textoPassoAPasso.textItem.contents;

				if(textoPassoAPasso.textItem.contents.length==1) {
					textoPassoAPasso.textItem.contents = passo;
				}
				else {
					textoPassoAPasso.textItem.contents += passo;
				}

				listaHeight = getRealTextLayerDimensions(textoPassoAPasso).height;
				if (listaHeight > 661) {
					textoPassoAPasso.textItem.contents = itensOld;
					nPagina++;

					layerImagem = grupoPreparo.layers.getByName("imagem");
					//Carrega a imagem de destaque dos ingredientes e salva a imagem
					salvarImagem(imagemBase,layerImagem,textoAssinatura);
					
					//Caso não tenha mantido a imagem dos ingredientes
					imagemBase = decodeURI(File($.fileName).parent) + '/' + receita.dirBase + receita.imgPreparo;
	
					//Muda layout
					mudaLayout();

					textoPassoAPasso.textItem.contents = "";
					textoPassoAPasso.textItem.contents = passo + '\r';
				}
				else {
					textoPassoAPasso.textItem.contents += '\r';
				}
			}
			nPagina++;
			grupoDica.visible = false;

			layerImagem = grupoPreparo.layers.getByName("imagem");
			//Carrega a imagem de destaque dos ingredientes e salva a imagem
			salvarImagem(imagemBase,layerImagem,textoAssinatura);
			
			//Caso não tenha mantido a imagem dos ingredientes
			imagemBase = decodeURI(File($.fileName).parent) + '/' + receita.dirBase + receita.imgPreparo;
			
			//Muda layout
			mudaLayout();
		}
		else {
			for (var i = 0; i < receita.preparo.length; i++) {
				var etapa = receita.preparo[i];

				var layerSubTitulo = grupoPreparo.layers.getByName('sub-titulo');
				layerSubTitulo.textItem.contents = etapa.nome;
				
				textoPassoAPasso.textItem.contents = "";

				for (var j = 0; j < etapa.passos.length; j++) {
					var passo = etapa.passos[j];
					itensOld = textoPassoAPasso.textItem.contents;

					if(textoPassoAPasso.textItem.contents.length==1) {
						textoPassoAPasso.textItem.contents = passo;
					}
					else {
						textoPassoAPasso.textItem.contents += passo;
					}

					listaHeight = getRealTextLayerDimensions(textoPassoAPasso).height;
					if (listaHeight > 544) {
						textoPassoAPasso.textItem.contents = itensOld;
						nPagina++;

						layerImagem = grupoPreparo.layers.getByName("imagem");
						//Carrega a imagem de destaque dos ingredientes e salva a imagem
						salvarImagem(imagemBase,layerImagem,textoAssinatura);

						//Caso não tenha mantido a imagem dos ingredientes
						imagemBase = decodeURI(File($.fileName).parent) + '/' + receita.dirBase + receita.imgPreparo;

						//Muda Layout
						mudaLayout();

						var layerSubTitulo = grupoPreparo.layers.getByName('sub-titulo');
						layerSubTitulo.textItem.contents = etapa.nome;

						textoPassoAPasso.textItem.contents = "";
						textoPassoAPasso.textItem.contents = passo + '\r';						
					}
					else {
						textoPassoAPasso.textItem.contents += '\r';
					}
				}
				nPagina++;
				
				//se for a última imagem esconde a dica
				if(i==(receita.preparo.length-1)) {
					grupoDica.visible = false;
				}

				layerImagem = grupoPreparo.layers.getByName("imagem");
				//Carrega a imagem de destaque dos ingredientes e salva a imagem
				salvarImagem(imagemBase,layerImagem,textoAssinatura);

				//Caso não tenha mantido a imagem dos ingredientes
				imagemBase = decodeURI(File($.fileName).parent) + '/' + receita.dirBase + receita.imgPreparo;
				
				//Muda layout
				mudaLayout();
			}
		}
				
		grupoPreparo.visible = false;
	}

	function processaReceita(receita) {
		var strtRulerUnits = app.preferences.rulerUnits;
		var strtTypeUnits = app.preferences.typeUnits;

		nPagina = 1;
		nLayout = 1;

		var fileRef = new File(decodeURI(File($.fileName).parent) + '/' + receita.modelo);
		docReceita = open(fileRef);
		
		//tornando invisivel todos os grupos
		for (var i = 0; i < docReceita.layerSets.length; i++) {
			docReceita.layerSets[i].visible = false;
		}
		
		capa();
		if(receita.modelo.indexOf('simples') !== -1) {
			ingredientes('simples');
			preparo('simples');
		}
		else if(receita.modelo.indexOf('etapas') !== -1) {
			ingredientes('etapas');
			preparo('etapas');
		}

		docReceita.close(SaveOptions.DONOTSAVECHANGES);

		app.preferences.rulerUnits = strtRulerUnits; 
		app.preferences.typeUnits = strtTypeUnits;
	}

	log("Início da Exportação das Receitas");
	
	var receitas = loadJson(receitasJSON);
	for (var j = 0; j < receitas.length; j++) {
		var receita = receitas[j];
		if ( (receita.titulo!=undefined) && (id == 0 || id == receita.id) ) {
			processaReceita(receita);
		}
	}

	log("Fim da Exportação das Receitas");
}