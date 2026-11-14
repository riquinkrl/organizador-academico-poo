import  { AcoesItemAcademico } from "../contratos/acoes-item";
import type { Origem } from "../contratos/acoes-atividade";

export abstract class ItemAcademico implements AcoesItemAcademico {
    private static contador: number = 0;
    protected readonly id: string;
    protected  titulo: string;
    protected  descricao: string;
    protected readonly dataCriacao: Date;
    protected readonly workspaceId: string;

    constructor(titulo:string, descricao:string, workspaceId: string){
        this.titulo = ItemAcademico.validarTitulo(titulo);
        this.descricao = descricao.trim();
        this.workspaceId = workspaceId;
        this.dataCriacao = new Date();

        ItemAcademico.contador += 1;
        this.id = `item-${Date.now()}-${ItemAcademico.contador}`;

    }

    protected static validarTitulo(titulo: string): string{
        const limpo: string = titulo.trim();
        if(limpo === ""){
            throw new Error("O título não pode ser vazio.");
        }
        return limpo
    }

    getId():string {
        return this.id;
    }

    getTitulo():string {
        return this.titulo;
    }

    getDescricao():string {
        return this.descricao;
    }

    getDataCriacao():Date {
        return new Date(this.dataCriacao);
    }

    getWorkspaceId():string {
        return this.workspaceId;
    }

    obterResumo():string {
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
        throw new Error("Este tipo de item não pode ser concluído. ");
    }

    abstract obterCategoria(): string;
    abstract estaPendente(): boolean;
    abstract obterExibicaoFormatada(): string;
    
}