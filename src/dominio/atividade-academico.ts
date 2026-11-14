import { ItemAcademico } from "./item-academico";
import type { AcoesAtividadePratica, Origem, SubtarefaChecklist } from "../contratos/acoes-atividade";

const msPorDia: number = 24 * 60 * 60 * 1000;

export class AtividadePratica extends ItemAcademico implements AcoesAtividadePratica {
    private readonly dataLimite: Date;
    private concluida: boolean = false;
    private dataConclusao?: Date;
    private readonly origem: Origem;
    private readonly checklist: Array<SubtarefaChecklist> = [];
    private linkEntrega?: string;

    constructor(titulo: string, descricao: string, workspaceId: string, dataLimite: Date, origem: Origem, linkEntrega?: string){
        super(titulo, descricao, workspaceId);

        if(!Number.isNaN(dataLimite.getTime())){
            this.dataLimite = new Date(dataLimite.getTime());
            this.origem = origem;

            if(linkEntrega){
                this.linkEntrega = linkEntrega.trim();
            } else{
                this.linkEntrega = undefined;
            } 
        } else{
            throw new Error("Data limite inválida.")
        }
    }
    obterCategoria(): string {
        return "Atividade Prática";
    }

    estaPendente(): boolean {
        return !this.concluida;
    }

    obterExibicaoFormatada(): string {
        let situacao: string;

        if(this.concluida){
            situacao = "Concluída";
        } else{
            situacao = "Pendente";
        }
        return `${this.getTitulo()} — ${situacao} (prazo: ${this.dataLimite.toLocaleDateString("pt-BR")})`;
    }

    marcarComoConcluida(agora?: Date): void {
        let dataReferencia: Date;

        if(agora){
            dataReferencia = agora;
        } else{
            dataReferencia = new Date();
        }

        if(!this.concluida){
            this.concluida = true;
            this.dataConclusao = new Date(dataReferencia.getTime());
        } else{
            throw new Error("A atividade já está concluída.");
        }
    }

    reabrirAtividade(): void {
        if(this.concluida){
            this.concluida = false;
            this.dataConclusao = undefined;
        } else{
            throw new Error("A atividade já está pendente.");
        }
    }

    verificarSeAtrasada(agora?: Date): boolean {
        let dataReferencia: Date;

        if(agora){
            dataReferencia = agora;
        } else{
            dataReferencia = new Date();
        }

        if(this.estaPendente() && dataReferencia.getTime() > this.dataLimite.getTime()){
            return true;
        } else{
            return false;
        }
        
    }

    calcularDiasRestantes(agora?: Date): number {
         let dataReferencia: Date;

        if(agora){
            dataReferencia = agora;
        } else{
            dataReferencia = new Date();
        }

        const diferenca: number = this.dataLimite.getTime() - dataReferencia.getTime();
        const resto: number = diferenca % msPorDia;
        let dias: number = (diferenca - resto) / msPorDia;

        if(resto > 0){
            dias++;
        }

        return dias;
    }

    atualizarLinkEntrega(novoLink: string): void {
        const limpo = novoLink.trim();

        if(limpo){
            this.linkEntrega = limpo;
        } else{
            throw new Error("O link de entrega não pode ser vazio.");
        }
    }

    adicionarSubtarefa(descricao: string): void {
        const limpa: string = descricao.trim();

        if(limpa){
            this.checklist.push({descricao: limpa, feita: false });
        } else{
            throw new Error("A subtarefa não pode ser vazia.");
        }
    }

    alternarSubtarefa(indice: number): void {
        const sub: SubtarefaChecklist | undefined = this.checklist[indice];

        if(sub){
            sub.feita = !sub.feita;
        } else{
            throw new Error("Subtarefa inexistente.")
        }
    }

    removerSubtarefa(indice: number): void {
        if(indice >= 0 && indice < this.checklist.length){
            this.checklist.splice(indice, 1);
        } else{
            throw new Error("Índice de subtarefa inválido.");
        }
    }

    calcularProgressoChecklist(): number {
        if(this.checklist.length > 0){
            let concluidas: number = 0;

            for(const sub of this.checklist){
                if(sub.feita){
                    concluidas++;
                }
            }

            const porcentagem: number = (concluidas / this.checklist.length) * 100;
            return Number(porcentagem.toFixed(0));
        } else{
            return 0;
        }
    }

    getConcluida():boolean{
        return this.concluida;
    }

    getChecklist(): readonly SubtarefaChecklist[] {
        return this.checklist.map((s) =>({descricao: s.descricao, feita: s.feita}));
    }

    getOrigem(): Origem {
        return this.origem;
    }

    getDataLimite(): Date {
        return new Date(this.dataLimite.getTime());
    }

    getDataConclusao(): Date | undefined {
        if(this.dataConclusao){
            return new Date(this.dataConclusao.getTime());
        } else{
            return undefined;
        }
    }

    getLinkEntrega(): string | undefined {
        return this.linkEntrega;
    }
}

