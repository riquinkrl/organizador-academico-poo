import type { AcoesItemAcademico } from "../contratos/acoes-item";
import { AcoesWorkspace } from "../contratos/acoes-workspace";

export class Workspace implements AcoesWorkspace {
    private readonly itens: Array<AcoesItemAcademico> = new Array<AcoesItemAcademico>();

    constructor(
        public readonly codigo: string,
        public readonly nome: string,
        public readonly professor: string,
        public readonly salaOuLink?: string,
        public readonly horario?: string
    ) {
        if(codigo.trim() === ""){
            throw new Error ("O código do workspace não pode ser vazio.");
        }
        if (nome.trim() === ""){
            throw new Error ("O nome do workspace não pode ser vazio.")
        }
    }

    adicionarItem(item: AcoesItemAcademico): void {
        this.itens.push(item);
    }

    buscarItem(id: string): AcoesItemAcademico | undefined {
        return this.itens.find((item) => item.getId() === id);
    }

    removerItem(id: string): boolean {
        const indice = this.itens.findIndex((item) => item.getId() === id);
        if (indice === -1){
            return false;
        }
        this.itens.splice(indice,1);
        return true;
    }

    listarItens():Array<AcoesItemAcademico> {
        return [...this.itens];
    }

    listarPendentes(agora?: Date): Array<AcoesItemAcademico>{
        return this.itens.filter((item) => item.estaPendente(agora));
    }

    listarConcluidos(): Array<AcoesItemAcademico> {
        return this.itens.filter((item) => item.estaConcluido());
    }

    listarAtrasados(agora?: Date): Array<AcoesItemAcademico> {
        return this.itens.filter((item) => item.verificarSeAtrasada(agora));
    }

    private atividades(): Array<AcoesItemAcademico>{
        return this.itens.filter((item) => item.exigeEntrega());
    }
    totalDeAtividades(): number {
        return this.atividades().length;
    }

    taxaDeConclusao(): number {
        const atividades = this.atividades();
        if (atividades.length === 0){
            return 0;
        }
        const concluidas = atividades.filter((item) => item.estaConcluido()).length;
        return (concluidas / atividades.length) * 100;
    }

    listarLembretesFixados(): Array<AcoesItemAcademico> {
        return this.itens.filter((item) => item.estaFixado());
    }

    ordenarPorPrazo(): Array<AcoesItemAcademico> {
        return this.itens
        .filter((item) => item.obterPrazo() !== undefined)
        .sort((a,b) => a.obterPrazo()!.getTime() - b.obterPrazo()!.getTime());
    }

    ordenarPorDataCadastro(): Array<AcoesItemAcademico> {
        return [...this.itens].sort(
            (a,b) => a.getDataCriacao().getTime() -b.getDataCriacao().getTime()
        );
    }

    ordenarPorOrigem(): Array<AcoesItemAcademico> {
        return this.itens
        .filter((item) => item.obterOrigem() !== undefined)
        .sort((a,b) => a.obterOrigem()!.localeCompare(b.obterOrigem()!));
    }

    buscarPorTexto(termo: string): Array<AcoesItemAcademico>{
        const busca = termo.trim().toLowerCase();
        return this.itens.filter(
            (item) =>
                item.getTitulo().toLowerCase().includes(busca) ||
                item.getDescricao().toLowerCase().includes(busca)
        );
    }
}