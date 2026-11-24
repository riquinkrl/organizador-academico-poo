import { Workspace } from "../dominio/workspace";
import { AtividadePratica } from "../dominio/atividade-academico";
import { TrabalhoEmGrupo } from "../dominio/trabalho-em-grupo";
import { Lembrete } from "../dominio/lembrete";

function verificar(descricao: string, condicao: boolean): void {
    console.log(`${condicao ? "OK    " : "FALHOU"} - ${descricao}`);
}

function lancaErro(acao: () => void): boolean {
    try {
        acao();
        return false;
    } catch {
        return true;
    }
}

const DIA = 24 * 60 * 60 * 1000;
const amanha = new Date(Date.now() + DIA);
const em3Dias = new Date(Date.now() + 3 * DIA);
const em10Dias = new Date(Date.now() + 10 * DIA);

// 1. Invariantes do construtor
console.log("\n--- Invariantes ---");
verificar("código vazio lança erro", lancaErro(() => new Workspace("", "POO", "Prof")));
verificar("nome só com espaços lança erro", lancaErro(() => new Workspace("ADS1", "   ", "Prof")));

// 2. Workspace vazio
console.log("\n--- Workspace vazio ---");
const vazio = new Workspace("ADS0001", "Banco de Dados", "Prof");
verificar("total começa em 0", vazio.totalDeAtividades() === 0);
verificar("taxa de conclusão vazia é 0", vazio.taxaDeConclusao() === 0);
verificar("buscar id inexistente devolve undefined", vazio.buscarItem("x") === undefined);
verificar("remover id inexistente devolve false", vazio.removerItem("x") === false);

// 3. Três tipos de item na mesma lista (polimorfismo)
console.log("\n--- Polimorfismo ---");
const ws = new Workspace("ADS0304", "Programação Orientada a Objetos", "Iallen");

const seminario = new TrabalhoEmGrupo(
    "Seminário", "Apresentar padrões de projeto", "ADS0304", em3Dias, "Slides", ["Ana", "Bruno"]
);
seminario.adicionarEtapa("Pesquisa", "Ana");
seminario.adicionarEtapa("Slides", "Eu");

const prova = new Lembrete("Prova", "Levar documento", "ADS0304", "Aviso de Aula", em10Dias, true);
const lista = new AtividadePratica("Lista 1", "Exercícios de herança", "ADS0304", amanha, "PROFESSOR");
const material = new Lembrete("Material", "Levar notebook", "ADS0304", "Material Necessário");

// ordem de inserção diferente da ordem de prazo, de propósito
ws.adicionarItem(seminario);
ws.adicionarItem(prova);
ws.adicionarItem(lista);
ws.adicionarItem(material);

verificar("listarItens tem 4 itens", ws.listarItens().length === 4);
verificar("buscarItem encontra pelo id", ws.buscarItem(lista.getId()) === lista);
verificar("totalDeAtividades conta só quem exige entrega (2)", ws.totalDeAtividades() === 2);
verificar("3 pendentes (lista, seminário e lembrete com aviso futuro)", ws.listarPendentes().length === 3);
verificar("nenhum atrasado hoje", ws.listarAtrasados().length === 0);
verificar("2 atrasados daqui a 10 dias", ws.listarAtrasados(em10Dias).length === 2);

// 4. Filtros, ordenação e busca
console.log("\n--- Filtros, ordenação e busca ---");
verificar("1 lembrete fixado", ws.listarLembretesFixados().length === 1);
verificar("o fixado é a prova", ws.listarLembretesFixados()[0] === prova);

const porPrazo = ws.ordenarPorPrazo();
verificar("ordenarPorPrazo ignora quem não tem prazo (2 itens)", porPrazo.length === 2);
verificar("prazo mais próximo primeiro (lista)", porPrazo[0] === lista);
verificar("depois o seminário", porPrazo[1] === seminario);
verificar("ordenar não bagunça a lista interna", ws.listarItens()[0] === seminario);

verificar("ordenarPorDataCadastro devolve os 4 itens", ws.ordenarPorDataCadastro().length === 4);
verificar("ordenarPorOrigem só traz itens com origem (2)", ws.ordenarPorOrigem().length === 2);

verificar("busca por título acha o seminário", ws.buscarPorTexto("semin")[0] === seminario);
verificar("busca ignora maiúsculas", ws.buscarPorTexto("PROVA")[0] === prova);
verificar("busca na descrição acha a lista", ws.buscarPorTexto("herança")[0] === lista);
verificar("busca sem resultado devolve lista vazia", ws.buscarPorTexto("zzz").length === 0);

// 5. Encapsulamento
console.log("\n--- Encapsulamento ---");
const copia = ws.listarItens();
copia.length = 0;
verificar("esvaziar a cópia não afeta o workspace", ws.listarItens().length === 4);

// 6. Remoção
console.log("\n--- Remoção ---");
verificar("remover item existente devolve true", ws.removerItem(material.getId()) === true);
verificar("agora são 3 itens", ws.listarItens().length === 3);
verificar("remover de novo devolve false", ws.removerItem(material.getId()) === false);

// 7. Conclusão e taxa
console.log("\n--- Conclusão e taxa ---");
lista.marcarComoConcluida();
verificar("1 concluído", ws.listarConcluidos().length === 1);
verificar("taxa de conclusão é 50", ws.taxaDeConclusao() === 50);

verificar(
    "concluir seminário com etapas pendentes lança erro",
    lancaErro(() => seminario.marcarComoConcluida())
);
seminario.marcarEtapaComoEntregue(0);
seminario.marcarEtapaComoEntregue(1);
verificar("seminário concluído ao entregar todas as etapas", seminario.estaConcluido());
verificar("taxa de conclusão é 100", ws.taxaDeConclusao() === 100);