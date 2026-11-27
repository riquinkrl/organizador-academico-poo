import type { AcoesItemAcademico } from "./acoes-item";

export interface AcoesWorkspace {
    adicionarItem(item: AcoesItemAcademico): void;
    buscarItem(id: string): AcoesItemAcademico | undefined;
    removerItem(id: string): boolean;
    listarItens(): Array<AcoesItemAcademico>;
    listarPendentes(agora?: Date): Array<AcoesItemAcademico>;
    listarConcluidos(): Array<AcoesItemAcademico>;
    listarAtrasados(agora?: Date): Array<AcoesItemAcademico>;
    totalDeAtividades(): number;
    taxaDeConclusao(): number; 
    listarLembretesFixados(): Array<AcoesItemAcademico>;
    ordenarPorPrazo(): Array<AcoesItemAcademico>;
    ordenarPorDataCadastro(): Array<AcoesItemAcademico>;
    ordenarPorOrigem(): Array<AcoesItemAcademico>;
    buscarPorTexto(termo:string): Array<AcoesItemAcademico>;
}