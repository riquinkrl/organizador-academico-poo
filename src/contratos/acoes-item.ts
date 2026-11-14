import { Origem } from "./acoes-atividade";

export interface AcoesItemAcademico {
    obterCategoria(): string;
    estaPendente(): boolean;
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