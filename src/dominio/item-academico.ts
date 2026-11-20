import type { AcoesItemAcademico } from "../contratos/acoes-item";
import type { Origem, RegistroItemAcademico } from "../contratos/tipos";
import {dataValida, textoObrigatorio } from "./validacao";

export abstract class ItemAcademico implements AcoesItemAcademico {
    protected readonly id: string;
    protected readonly titulo: string;
    protected readonly descricao: string;
    protected readonly dataCriacao: Date;
    protected readonly workspaceId: string;

    constructor(titulo: string, descricao: string, workspaceId: string, registro?: RegistroItemAcademico){
        this.titulo = textoObrigatorio(titulo, "o título");
        this.descricao = descricao.trim();
        this.workspaceId = textoObrigatorio(workspaceId, "a disciplina").toUpperCase();
        this.dataCriacao = registro ? dataValida(registro.dataCriacao) : new Date();
        this.id = registro ? textoObrigatorio(registro.id, "o identificador") : this.gerarId();
    }

    private static contador: number = 0;
    
    private gerarId(): string {
        ItemAcademico.contador += 1;
        const instante: number = this.dataCriacao.getTime();
        const numeroAleatorio: number = Math.random();
        return `item-${instante}-${ItemAcademico.contador}-${numeroAleatorio}`;
    }

    getId(): string {
        return this.id;
    }

    getTitulo(): string {
        return this.titulo;
    }

    getDescricao(): string {
        return this.descricao;
    }

    getDataCriacao(): Date {
        return new Date(this.dataCriacao);
    }

    getWorkspaceId(): string {
        return this.workspaceId;
    }

    obterResumo(): string {
        return `${this.obterCategoria()}: ${this.titulo}`;
    }

    verificarSeAtrasada(agora?: Date): boolean {
        return false;
    }
    
    estaConcluido(): boolean {
        return false;
    }

    estaFixado(): boolean {
        return false;
    }

    exigeEntrega(): boolean {
        return false;
    }

    obterPrazo(): Date | undefined {
        return undefined;
    }

    obterOrigem(): Origem | undefined {
        return undefined;
    }

    obterDataConclusao(): Date | undefined {
        return undefined;
    }

    marcarComoConcluida(agora?: Date): void {
        throw new Error("Este tipo de item não pode ser concluído.");
    }

    abstract obterCategoria(): string;
    abstract estaPendente(agora?: Date): boolean;
    abstract obterExibicaoFormatada(): string;
}
