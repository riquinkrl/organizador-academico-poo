import { ItemAcademico } from "./item-academico";
import type { AcoesTrabalhoEmGrupo, EtapaTrabalho } from "../contratos/acoes-trabalho-grupo";

export class TrabalhoEmGrupo extends ItemAcademico implements AcoesTrabalhoEmGrupo {
    private readonly dataLimite: Date;
    private concluida: boolean = false;
    private dataConclusao?: Date;
    private readonly colegasDeEquipe: Array<string>;
    private readonly papelDoAluno: string;
    private readonly etapas: Array<EtapaTrabalho> = [];

    constructor(titulo: string, descricao: string, workspaceId: string, dataLimite: Date, papelDoAluno: string, colegasDeEquipe: Array<string> = []) {
        super(titulo, descricao, workspaceId);

    this.dataLimite = ItemAcademico.validarEClonarData(dataLimite, "Data limite inválida.");

    this.papelDoAluno = ItemAcademico.validarTextoObrigatorio(papelDoAluno, "O papel do aluno não pode ser vazio.");

    this.colegasDeEquipe = TrabalhoEmGrupo.validarColegas(colegasDeEquipe);
    }

    private static validarColegas(nomes: Array<string>): Array<string> {
        const validados: Array<string> = [];
        for(const nome of nomes){
            validados.push(ItemAcademico.validarTextoObrigatorio(nome, "O nome do colega de equipe não pode ser vazio."));
        }
        return validados;
    }

    private contarEtapasEntregues(): number {
        let entregues: number = 0;
        for(const etapa of this.etapas){
            if(etapa.entregue){
                entregues++;
            }
        }
        return entregues;
    }

    private todasEtapasEntregues(): boolean {
        return this.etapas.length > 0 && this.contarEtapasEntregues() === this.etapas.length;
    }

    obterCategoria(): string {
        return "Trabalho em Grupo";
    }

    estaPendente(): boolean {
        return !this.concluida;
    }

    obterExibicaoFormatada(): string {
        let situacao: string;

        if(this.concluida){
            situacao = "Concluído";
        } else {
            situacao = `Pendente (${this.calcularProgressoEquipe()}%)`;
        }
        return `${this.getTitulo()} - ${situacao} (prazo: ${this.dataLimite.toLocaleDateString("pt-BR")})`;
    }

    override estaConcluido(): boolean {
        return this.concluida;
    }

    override exigeEntrega(): boolean {
        return true;
    }

    override obterPrazo(): Date | undefined {
        return new Date(this.dataLimite.getTime());
    }

    override obterDataConclusao(): Date | undefined {
        if(!this.dataConclusao){
            return undefined;
        }
        return new Date(this.dataConclusao.getTime());
    }

    override verificarSeAtrasada(agora?: Date): boolean {
        const dataReferencia: Date = ItemAcademico.obterDataReferencia(agora);

        return this.estaPendente() && dataReferencia.getTime() > this.dataLimite.getTime();
    }

    override marcarComoConcluida(agora?: Date): void {
        const dataReferencia: Date = ItemAcademico.obterDataReferencia(agora);

        if(this.concluida){
            throw new Error("O trabalho em grupo já está concluído.");
        }
        if(!this.todasEtapasEntregues()){
            throw new Error("Todas as etapas devem ser entregues antes de concluir o trabalho.");
        }
        this.concluida = true;
        this.dataConclusao = dataReferencia;
    }
    
    adicionarColega(nome: string): void {
        const limpo: string = ItemAcademico.validarTextoObrigatorio(nome, "O nome do colega de equipe não pode ser vazio.");

        this.colegasDeEquipe.push(limpo);
    }
    
    removerColega(indice: number): void {
        if(indice < 0 || indice >= this.colegasDeEquipe.length){
            throw new Error("Índice de colega inválido.");
        }
        this.colegasDeEquipe.splice(indice, 1);
    }

    adicionarEtapa(titulo: string, responsavel: string): void {
        const tituloLimpo: string = ItemAcademico.validarTextoObrigatorio(titulo, "O título da etapa não pode ser vazio.");

        const responsavelLimpo: string = ItemAcademico.validarTextoObrigatorio(responsavel, "O responsável pela etapa não pode ser vazio.");

        if(this.concluida){
            throw new Error("Não é possível adicionar etapas a um trabalho concluído.");
        }
        this.etapas.push({titulo: tituloLimpo, responsavel: responsavelLimpo, entregue: false});
    }

    marcarEtapaComoEntregue(indice: number): void {
        const etapa: EtapaTrabalho | undefined = this.etapas[indice];

        if(!etapa){
            throw new Error("Etapa inexistente.");
        }
        if(etapa.entregue){
            throw new Error("A etapa já foi entregue.");
        }
        etapa.entregue = true;
    }

    calcularProgressoEquipe(): number {
        return ItemAcademico.calcularPorcentagem(this.contarEtapasEntregues(), this.etapas.length);
    }

    calcularDiasRestantes(agora?: Date): number {
        return ItemAcademico.calcularDiasAte(this.dataLimite, ItemAcademico.obterDataReferencia(agora));
    }

    getPapelDoAluno(): string {
        return this.papelDoAluno;
    }

    getColegasDeEquipe(): readonly string[] {
        return this.colegasDeEquipe.slice();
    }

    getEtapas(): readonly EtapaTrabalho[] {
        return this.etapas.map((e) => ({titulo: e.titulo, responsavel: e.responsavel, entregue: e.entregue}));
    }
}