import type { AcoesAtividadePratica } from "../contratos/acoes-atividade";
import type { Origem, Passo, RegistroItemAcademico } from "../contratos/tipos";
import { ItemAcademico } from "./item-academico";
import { dataValida, textoObrigatorio } from "./validacao";

export class AtividadePratica extends ItemAcademico implements AcoesAtividadePratica {
    private readonly dataLimite: Date;
    private dataConclusao?: Date;
    private readonly checklist: Array<Passo> = [];
    private readonly linkEntrega?: string;

    constructor(titulo: string, descricao: string, workspaceId: string, prazo: Date,
        private readonly origem: Origem, checklist?: Array<Passo>, linkEntrega?: string,
        registro?: RegistroItemAcademico, conclusao?: Date) {
        super(titulo, descricao, workspaceId, registro);

        this.dataLimite = dataValida(prazo);
        if (origem !== "PROFESSOR" && origem !== "AUTOESTUDO"){
            throw new Error("Origem inválida.");
        } 
        if (checklist !== undefined) {
            for (const passo of checklist) {
                const copia: Passo = {
                    descricao: textoObrigatorio(passo.descricao, "a descrição do passo"),
                    feita: passo.feita,
                };
                this.checklist.push(copia);
            }
        }
        this.linkEntrega = this.validarLinkEntrega(linkEntrega);

        if (conclusao){
            this.registrarConclusao(conclusao);
        }
    }

    private validarLinkEntrega(linkEntrega?: string): string | undefined {
        const link: string | undefined = linkEntrega?.trim();
        if (!link){ 
            return undefined;
        }

        let url: URL;
        try {
            url = new URL(link);
        } catch {
            throw new Error("Informe um link de entrega válido.");
        }
        if (url.protocol !== "https:" && url.protocol !== "http:") {
            throw new Error("O link de entrega deve usar HTTP ou HTTPS.");
        }
        return url.href;
    }

    obterCategoria(): string {
        return "Atividade Prática"; 
    }

    exigeEntrega(): boolean { 
        return true; 
    }

    estaPendente(): boolean { 
        return !this.estaConcluido(); 
    }

    estaConcluido(): boolean { 
        return this.dataConclusao !== undefined; 
    }

    obterPrazo(): Date { 
        return new Date(this.dataLimite); 
    }

    obterOrigem(): Origem { 
        return this.origem; 
    }

    obterDataConclusao(): Date | undefined {
        return this.dataConclusao && new Date(this.dataConclusao);
    }

    listarChecklist(): Array<Passo> {
        const copia: Array<Passo> = [];

        for (const passo of this.checklist) {
            copia.push({
                descricao: passo.descricao,
                feita: passo.feita,
            });
        }
        return copia;
    }

    definirPasso(indice: number, feita: boolean): void {
        if (!Number.isInteger(indice) || indice < 0 || indice >= this.checklist.length) {
            throw new Error("Passo inexistente.");
        }

        this.checklist[indice].feita = feita;
    }

    marcarComoConcluida(agora: Date = new Date()): void {
        if (!this.estaConcluido()){
             this.registrarConclusao(agora);
        }
    }

    private registrarConclusao(data: Date): void {
        const conclusao: Date = dataValida(data);

        if (conclusao < this.dataCriacao){
            throw new Error("A conclusão não pode anteceder o cadastro.");
        }
        
        this.dataConclusao = conclusao;
    }

    verificarSeAtrasada(agora: Date = new Date()): boolean {
        return this.estaPendente() && this.dataLimite < agora;
    }

    calcularDiasRestantes(agora: Date = new Date()): number {
       const milissegundosPorDia: number = 24 * 60 * 60 * 1000;
       const tempoRestante: number = this.dataLimite.getTime() - agora.getTime();
       const diasRestantes: number = tempoRestante / milissegundosPorDia;

       return Math.ceil(diasRestantes);
    }

    obterExibicaoFormatada(): string {
        return `${this.obterResumo()} · Prazo: ${this.dataLimite.toLocaleString("pt-BR")}`;
    }

    obterLinkEntrega(): string | undefined { 
        return this.linkEntrega; 
    }
}
