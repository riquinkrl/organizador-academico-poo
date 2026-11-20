import type { Origem } from "./tipos";

export interface AcoesItemAcademico {
    getId(): string;
    getTitulo(): string;
    getDescricao(): string;
    getDataCriacao(): Date;
    getWorkspaceId(): string;
    obterResumo(): string;
    obterCategoria(): string;
    estaPendente(agora?: Date): boolean;
    obterExibicaoFormatada(): string;
    verificarSeAtrasada(agora?: Date): boolean;
    marcarComoConcluida(agora?: Date): void;
    estaConcluido(): boolean;
    estaFixado(): boolean;
    exigeEntrega(): boolean;
    obterPrazo(): Date | undefined;
    obterOrigem(): Origem | undefined;
    obterDataConclusao(): Date | undefined;
}
