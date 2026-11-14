import { ItemAcademico } from "./item-academico";
import type { AcoesTrabalhoEmGrupo, EtapaTrabalho } from "../contratos/acoes-trabalho-grupo";

const msPorDia: number = 24 * 60 * 60 * 1000;

export class TrabalhoEmGrupo extends ItemAcademico implements AcoesTrabalhoEmGrupo {
    private readonly dataLimite: Date;
    private concluida: boolean = false;
    private dataConclusao?: Date;
    private readonly colegasDeEquipe: Array<string> = [];
    private readonly papelDoAluno: string;
    private readonly etapas: Array<EtapaTrabalho> = [];

    constructor(
        titulo: string,
        descricao: string,
        workspaceId: string,
        dataLimite: Date,
        papelDoAluno: string,
        colegasDeEquipe: Array<string> = []
    ) {
        super(titulo, descricao, workspaceId);

        this.dataLimite = ItemAcademico.validarEClonarData(dataLimite, "Data limite inválida.");
        this.papelDoAluno = ItemAcademico.validarTextoObrigatorio(
            papelDoAluno,
            "O papel do aluno não pode ser vazio."
        );
        this.colegasDeEquipe = TrabalhoEmGrupo.validarColegas(colegasDeEquipe);
    }

    private static validarColegas(nomes: Array<string>): Array<string> {
        const validados: Array<string> = [];
        for (const nome of nomes) {
            const limpo: string = ItemAcademico.validarTextoObrigatorio(
                nome,
                "O nome do colega de equipe não pode ser vazio."
            );
            validados.push(limpo);
        }
        return validados;
    }

    private contarEtapasEntregues(): number {
        let entregues: number = 0;
        for (const etapa of this.etapas) {
            if (etapa.entregue) {
                entregues++;
            }
        }
        return entregues;
    }

    private todasEtapasEntregues(): boolean {
        if (this.etapas.length === 0) {
            return true;
        }
        return this.contarEtapasEntregues() === this.etapas.length;
    }

    obterCategoria(): string {
        return "Trabalho em Grupo";
    }

    estaPendente(): boolean {
        return !this.estaConcluido();
    }

    override estaConcluido(): boolean {
        return this.concluida && this.todasEtapasEntregues();
    }

    override exigeEntrega(): boolean {
        return true;
    }

    override obterPrazo(): Date {
        return new Date(this.dataLimite.getTime());
    }

    override obterDataConclusao(): Date | undefined {
        if (this.dataConclusao) {
            return new Date(this.dataConclusao.getTime());
        }
        return undefined;
    }

    obterExibicaoFormatada(): string {
        const situacao: string = this.estaConcluido()
            ? "Concluído"
            : `Pendente (${this.calcularProgressoEquipe()}%)`;
        return `${this.getTitulo()} — ${situacao} (prazo: ${this.dataLimite.toLocaleDateString("pt-BR")})`;
    }

    override verificarSeAtrasada(agora?: Date): boolean {
        const dataReferencia: Date = ItemAcademico.obterDataReferencia(agora);
        return this.estaPendente() && dataReferencia.getTime() > this.dataLimite.getTime();
    }

    override marcarComoConcluida(agora?: Date): void {
        if (this.estaConcluido()) {
            throw new Error("O trabalho em grupo já está concluído.");
        }
        if (!this.todasEtapasEntregues()) {
            throw new Error("Todas as etapas devem ser entregues antes de concluir o trabalho.");
        }

        const dataReferencia: Date = ItemAcademico.obterDataReferencia(agora);
        this.concluida = true;
        this.dataConclusao = new Date(dataReferencia.getTime());
    }

    adicionarColega(nome: string): void {
        const limpo: string = ItemAcademico.validarTextoObrigatorio(
            nome,
            "O nome do colega de equipe não pode ser vazio."
        );
        this.colegasDeEquipe.push(limpo);
    }

    removerColega(indice: number): void {
        if (indice < 0 || indice >= this.colegasDeEquipe.length) {
            throw new Error("Índice de colega inválido.");
        }
        this.colegasDeEquipe.splice(indice, 1);
    }

    adicionarEtapa(titulo: string, responsavel: string): void {
        const tituloLimpo: string = ItemAcademico.validarTextoObrigatorio(
            titulo,
            "O título da etapa não pode ser vazio."
        );
        const responsavelLimpo: string = ItemAcademico.validarTextoObrigatorio(
            responsavel,
            "O responsável pela etapa não pode ser vazio."
        );

        this.etapas.push({
            titulo: tituloLimpo,
            responsavel: responsavelLimpo,
            entregue: false
        });

        // Se uma nova etapa pendente é adicionada, o trabalho volta a ficar pendente
        if (this.concluida) {
            this.concluida = false;
            this.dataConclusao = undefined;
        }
    }

    marcarEtapaComoEntregue(indice: number): void {
        const etapa: EtapaTrabalho | undefined = this.etapas[indice];
        if (!etapa) {
            throw new Error("Etapa inexistente.");
        }
        etapa.entregue = true;
    }

    calcularProgressoEquipe(): number {
        if (this.etapas.length === 0) {
            return this.concluida ? 100 : 0;
        }

        const porcentagem: number = (this.contarEtapasEntregues() / this.etapas.length) * 100;
        return Number(porcentagem.toFixed(0));
    }

    calcularDiasRestantes(agora?: Date): number {
        const dataReferencia: Date = ItemAcademico.obterDataReferencia(agora);
        const diferenca: number = this.dataLimite.getTime() - dataReferencia.getTime();
        return Math.ceil(diferenca / msPorDia);
    }

    getPapelDoAluno(): string {
        return this.papelDoAluno;
    }

    getColegasDeEquipe(): readonly string[] {
        return [...this.colegasDeEquipe];
    }

    getEtapas(): readonly EtapaTrabalho[] {
        return this.etapas.map((e) => ({
            titulo: e.titulo,
            responsavel: e.responsavel,
            entregue: e.entregue
        }));
    }
}