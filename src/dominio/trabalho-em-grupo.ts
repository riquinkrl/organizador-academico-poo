import type { AcoesTrabalhoEmGrupo, EtapaTrabalho } from "../contratos/acoes-trabalho-grupo";
import type { Origem, Passo } from "../contratos/tipos";
import { AtividadePratica } from "./atividade-academico";
import { textoObrigatorio } from "./validacao";

export class TrabalhoEmGrupo extends AtividadePratica implements AcoesTrabalhoEmGrupo {
    private readonly colegasDeEquipe: Array<string> = [];
    private readonly papelDoAluno: string;
    private readonly etapas: Array<EtapaTrabalho> = [];

    constructor(
        titulo: string,
        descricao: string,
        workspaceId: string,
        dataLimite: Date,
        papelDoAluno: string,
        colegasDeEquipe?: Array<string>,
        origem: Origem = "PROFESSOR",
        checklist?: Array<Passo>,
        linkEntrega?: string,
    ) {
        super(titulo, descricao, workspaceId, dataLimite, origem, checklist, linkEntrega);
        this.papelDoAluno = textoObrigatorio(papelDoAluno, "o papel do aluno");

        if (colegasDeEquipe !== undefined) {
            for (const nome of colegasDeEquipe) {
                this.adicionarColega(nome);
            }
        }
    }

    override obterCategoria(): string {
        return "Trabalho em Grupo";
    }

    override obterExibicaoFormatada(): string {
        const situacao: string = this.estaConcluido()
            ? "Concluído"
            : `Pendente (${this.calcularProgressoEquipe()}%)`;
        return `${super.obterExibicaoFormatada()} · ${situacao}`;
    }

    override marcarComoConcluida(agora: Date = new Date()): void {
        if (this.contarEtapasEntregues() < this.etapas.length) {
            throw new Error("Todas as etapas devem ser entregues antes de concluir o trabalho.");
        }
        super.marcarComoConcluida(agora);
    }

    adicionarColega(nome: string): void {
        const nomeLimpo: string = textoObrigatorio(nome, "o nome do colega de equipe");
        this.colegasDeEquipe.push(nomeLimpo);
    }

    removerColega(indice: number): void {
        if (!Number.isInteger(indice) || indice < 0 || indice >= this.colegasDeEquipe.length) {
            throw new Error("Índice de colega inválido.");
        }
        this.colegasDeEquipe.splice(indice, 1);
    }

    adicionarEtapa(titulo: string, responsavel: string): void {
        if (this.estaConcluido()) {
            throw new Error("Não é possível adicionar etapas a um trabalho concluído.");
        }
        const etapa: EtapaTrabalho = {
            titulo: textoObrigatorio(titulo, "o título da etapa"),
            responsavel: textoObrigatorio(responsavel, "o responsável pela etapa"),
            entregue: false,
        };
        this.etapas.push(etapa);
    }

    marcarEtapaComoEntregue(indice: number, agora: Date = new Date()): void {
        if (!Number.isInteger(indice) || indice < 0 || indice >= this.etapas.length) {
            throw new Error("Etapa inexistente.");
        }
        const etapa: EtapaTrabalho = this.etapas[indice];
        if (etapa.entregue) {
            throw new Error("A etapa já foi entregue.");
        }

        const faltamEntregar: number = this.etapas.length - this.contarEtapasEntregues();
        if (faltamEntregar === 1) {
            super.marcarComoConcluida(agora);
        }
        etapa.entregue = true;
    }

    private contarEtapasEntregues(): number {
        let entregues: number = 0;
        for (const etapa of this.etapas) {
            if (etapa.entregue) entregues++;
        }
        return entregues;
    }

    calcularProgressoEquipe(): number {
        if (this.etapas.length === 0) {
            return this.estaConcluido() ? 100 : 0;
        }
        return this.contarEtapasEntregues() * 100 / this.etapas.length;
    }

    getPapelDoAluno(): string {
        return this.papelDoAluno;
    }

    getColegasDeEquipe(): ReadonlyArray<string> {
        return this.colegasDeEquipe.slice();
    }

    getEtapas(): ReadonlyArray<EtapaTrabalho> {
        const copia: Array<EtapaTrabalho> = [];
        for (const etapa of this.etapas) {
            copia.push({
                titulo: etapa.titulo,
                responsavel: etapa.responsavel,
                entregue: etapa.entregue,
            });
        }
        return copia;
    }
}
