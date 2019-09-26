#include ../json2.js
#include ../funcoes.jsx

(function main() {
	var mensagens = loadJson('telegram/TelegramOrdemFeed.json');

	var script = new File($.fileName);
	saveAsTextFile(script.path + '/tmp.bat', 'echo inicio ' + '\r', 'w');
	//for (var j = 0; j < mensagens.length; j++) {
		//var mensagem = mensagens[j];
		var mensagem = mensagens[0];

		var PATH_BASE = 'E:\\Herbalife\\Desafio do Emagrecimento Definitivo\\Script - Photoshop\\Instagram Coach\\';
		var LOCAL_PATH = PATH_BASE + 'export\\MARIOGUIMARAESCOACH\\' + mensagem.diretorio.replace(new RegExp("/", 'g'), "\\");
		var FILE_NAME = mensagem.prefixo + '*';
		var REMOTE_PATH = mensagem.diretorio;

		saveAsTextFile(script.path + '/tmp.bat', 'echo ' + mensagem.diretorio + '\r', 'a');

		var sCall = 'call "' + PATH_BASE + 'winscp\\EnviaArquivoFTP.bat' + '" "' + LOCAL_PATH + '" "' + FILE_NAME + '" "' + REMOTE_PATH + '"';
		saveAsTextFile(script.path + '/tmp.bat', sCall + '\r', 'a');

		app.system('for /f %i in (\'dir "' + LOCAL_PATH + FILE_NAME + '" /on /b\') do echo cscript "' + PATH_BASE + 'telegram\\enviarImagemTelegram.vbs" "https://perderbarrigadevez.com.br/ferramentas/Ordem Feed/' + REMOTE_PATH + '%i" >>"' + PATH_BASE + 'telegram\\tmp.bat"');

		var sMsg = mensagem.texto.replace(new RegExp('\r\n', 'g'), "\"\" \& chr(10) \& \"\"")
		sMsg = sMsg.replace(new RegExp('\n', 'g'), "\"\" \& chr(10) \& \"\"")
		saveAsTextFile(script.path + '/tmp.bat', 'cscript "' + PATH_BASE + 'telegram\\enviarMensagemTelegram.vbs" "' + sMsg  + '"' + '\r', 'a');
	//}
	saveAsTextFile(script.path + '/tmp.bat', 'echo fim ' + '\r', 'a');
	// var batTmp = new File(PATH_BASE + 'telegram\\tmp.bat');
	// batTmp.execute();
})();



// var batEnviarFoto = new File("E:/Herbalife/Desafio do Emagrecimento Definitivo/Script - Photoshop/Instagram Coach/enviarFotoFTP.vbs");
// batEnviarFoto.execute(); 

// var batFile = new File("E:/Herbalife/Desafio do Emagrecimento Definitivo/Script - Photoshop/Instagram Coach/enviarMensagemTelegram.vbs");
// batFile.execute(); 