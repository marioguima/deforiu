#include json2.js
#include marque/marque.jsx
#include receita/receitas.jsx
#include receita/receitas-story.jsx;
#include dica/dicas.jsx;
#include motivação/motivacoes.jsx;
#include motivação/motivacoes-story.jsx;
#include conteúdo/conteudos.jsx
#include resultado/resultados.jsx
#include agendamento/agendamentos.jsx
#include funcoes.jsx

(function main() {
	log("Início exportação");

	//var assinaturas = loadJson('assinaturas.json');
	var instagram = loadJson('instagram.json');

	marque('marque/marque.json', instagram, 0);
	// motivacoes('motivação/motivacoes.json', instagram, 0);
	// motivacoes_story('motivação/motivacoes-story.json', instagram, 0);
	// dicas('dica/dicas.json', instagram, 0);
	// receitas('receita/receitas.json', instagram, 0);
	// receitas_story('receita/receitas-story.json', instagram, 0);
	// conteudos('conteúdo/conteudos.json', instagram, 0);
	// resultados('resultado/resultados.json', instagram, 0);
	// agendamentos('agendamento/agendamentos.json', instagram, 30);
	// agendamentos('agendamento/agendamentos.json', instagram, 0);

	log("Fim exportação");

})();