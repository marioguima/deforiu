#include ../json2.js
#include ../funcoes.jsx
#include ../moment.js

function agendamentos(agendamentosJSON, instagram, dia) {
	var docMotivacao;
	var scriptFile = new File($.fileName);
	var pathFileSchedule = scriptFile.path + '/scripts/agendamento.sql';
	var pathScriptWinSCP = scriptFile.path + '/scripts/winscp.bat';
	var sDeleteFileTMP = '';
	var sPathWindows = scriptFile.path.replace(new RegExp("/", 'g'), "\\");
	sPathWindows = sPathWindows.substring(1,2) + ':' + sPathWindows.substring(2);
	sPathWindows = sPathWindows.replace(new RegExp("%20", 'g'), " ");
	var sFormato = "DD-MM-YYYY HH:mm:ss";

	function processaAgendamento(ordem, agendamento, nomePerfil, dataInicial, hora, userId, accountId) {
		//Incluir o arquivo
		var sPathFiles = scriptFile.path + '/..' + agendamento.diretorio.replace("[ASSINATURA]",nomePerfil);
		var inFolder = new Folder(sPathFiles);

		if(inFolder != null){
			var fileList = inFolder.getFiles(agendamento.prefixo + "*.jpg");
		}

		var aFilesName = new Array();
		
		for(var a = 0; a < fileList.length; a++)
		{
			var sTitle = fileList[a].name;
			var sFilename = ordem + '-' + fileList[a].name.replace('.jpg','') + '-' + randomString(10, "N") + '.jpg';
			aFilesName[a] = sFilename;
			var sFilesize = fileList[a].length;
			var sDate = timeStamp(2);

			var sComando = "INSERT INTO `np_files` (`user_id`, `title`, `info`, `filename`, `filesize`, `date`) VALUES(" + userId + ", '" + sTitle + "', '', '" + sFilename + "', '" + sFilesize + "', '" + sDate + "');";
			saveAsTextFile(pathFileSchedule, sComando + '\r', 'a');

			fileList[a].copy(scriptFile.path + '//temp//' + userId + '//' + sFilename);
			saveAsTextFile(pathScriptWinSCP, ' "put ' + sFilename + '" ^' + '\r', 'a');

			//Excluir os arquivos após enviar para o ftp
			sDeleteFileTMP += 'del "' + sPathWindows + '\\temp\\' + userId + '\\' + sFilename + '"\r';
		}

		//Agendar o post
		var sType = "timeline";
		if( (agendamento.prefixo.indexOf("P2-R")!=-1) || (agendamento.prefixo.indexOf("P2-D")!=-1) ) {
			var sType = "album";
		}
		var sCaption = agendamento.texto.replace(new RegExp("'", 'g'), "\\'");
		sCaption = sCaption.replace(new RegExp("\n", 'g'), "\\n");
		var sFirst_comment = agendamento.hashtags;

		var sSchedule_date = dataInicial;
		if (agendamento.prefixo.indexOf("P1-M")!=-1) {
			sSchedule_date = sSchedule_date + ' ' + hora.motivacao;
		}
		else if (agendamento.prefixo.indexOf("P2-R")!=-1) {
			sSchedule_date = sSchedule_date + ' ' + hora.receita;
		}
		else if (agendamento.prefixo.indexOf("P2-D")!=-1) {
			sSchedule_date = sSchedule_date + ' ' + hora.dica;
		}
		else if (agendamento.prefixo.indexOf("P2-F")!=-1) {
			sSchedule_date = sSchedule_date + ' ' + hora.resultado;
		}
		else if( (agendamento.prefixo.indexOf("P3-C")!=-1) ) {
			sSchedule_date = sSchedule_date + ' ' + hora.conteudo;
		}
		sSchedule_date = moment(sSchedule_date, sFormato).add(agendamento.dia-1, 'days').format(sFormato);
		sSchedule_date = moment(sSchedule_date, sFormato).add(3, 'hour').format(sFormato);
		//Formato de data do MySql
		sSchedule_date = moment(sSchedule_date, sFormato).format("YYYY-MM-DD HH:mm:ss");
		var sFilesName = aFilesName.join("','");

		var sComando = "INSERT INTO `np_posts` (`status`, `user_id`, `type`, `caption`, `first_comment`, `location`, `media_ids`, `remove_media`, `account_id`, `is_scheduled`, `create_date`, `schedule_date`, `publish_date`, `is_hidden`, `data`) VALUES('scheduled', " + userId + ", '" + sType + "', '" + sCaption + "', '" + sFirst_comment + "', '', (select GROUP_CONCAT(`id`) from `np_files` where `np_files`.`filename` in ('" + sFilesName + "')), '1', " + accountId + ", 1, SYSDATE(), '" + sSchedule_date + "', SYSDATE(), 0, '{}');";

		saveAsTextFile(pathFileSchedule, sComando + '\r\r', 'a');
	}

	log("Início: Geração script agendar posts");

	saveAsTextFile(pathFileSchedule, "/* Inicio do Script inclusao de Imagens e Posts */" + '\r\r', 'w');

	// O parâmetro 'w' sobrescreve o arquivo o 'a' adiciona as linhas ao final
	saveAsTextFile(pathScriptWinSCP, '"C:\\Program Files (x86)\\WinSCP\\WinSCP.com" /log="' + sPathWindows + '\\scripts\\WinSCP-files.log" /ini=nul /command ^' + '\r', 'w');
	saveAsTextFile(pathScriptWinSCP, ' "open ftp://mario972:*herbalife@ftp.marioguimaraes.com.br/" ^' + '\r', 'a');

	// for (var a = 0; a < 1; a++) {
	for (var a = 0; a < instagram.length; a++) {
		var sNomePerfil = instagram[a].nome_perfil;
		var sDataInicial = instagram[a].data_inicial;
		var vHora = instagram[a].hora;
		var nUserId = instagram[a].user_id;
		var nAccountId = instagram[a].account_id;

		if (nUserId > 0) {			
			// Diretorio dos arquivos
			mkdir(scriptFile.path + '/temp/' + nUserId);

			saveAsTextFile(pathScriptWinSCP, ' "cd /public_html/perderbarrigadevez.com.br/ferramentas/insta/assets/uploads/' + nUserId + '" ^' + '\r', 'a');	
			saveAsTextFile(pathScriptWinSCP, ' "lcd ""' + sPathWindows + '\\temp\\' + nUserId + '\\' + '""" ^' + '\r', 'a');

			saveAsTextFile(pathFileSchedule, "/* Inicio do Script do instagram " + sNomePerfil + " */" + "\r", "a");

			var agendamentos = loadJson(agendamentosJSON);
			// for (var j = 0; j < 2; j++) {
			for (var j = 0; j < agendamentos.length; j++) {
				var agendamento = agendamentos[j];
				if (agendamento.dia >= dia) {
					processaAgendamento(j+1, agendamento, sNomePerfil, sDataInicial, vHora, nUserId, nAccountId);
				}
			}

			saveAsTextFile(pathFileSchedule, "/* Fim do Script do instagram " + sNomePerfil + " */" + "\r", "a");
			saveAsTextFile(pathFileSchedule, "\r", "a");
		}

	}

	saveAsTextFile(pathFileSchedule, "/* Fim do Script inclusao de Imagens e Posts */" + '\r', 'a');

	saveAsTextFile(pathScriptWinSCP, ' "exit"' + '\r\r', 'a');
	saveAsTextFile(pathScriptWinSCP, 'echo off' + '\r', 'a');
	saveAsTextFile(pathScriptWinSCP, sDeleteFileTMP, 'a');

	log("Fim: Geração script agendar posts");
}