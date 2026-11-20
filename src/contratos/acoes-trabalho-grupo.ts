import type { AcoesAtividadePratica } from "./acoes-atividade";
import type { Etapa } from "./tipos";

export type EtapaTrabalho = Etapa;

export interface AcoesTrabalhoEmGrupo extends AcoesAtividadePratica {
    adicionarColega(nome: string): void;
    removerColega(indice: number): void;
    adicionarEtapa(titulo: string, responsavel: string): void;
    marcarEtapaComoEntregue(indice: number, agora?: Date): void;
    calcularProgressoEquipe(): number;
    getPapelDoAluno(): string;
    getColegasDeEquipe(): ReadonlyArray<string>;
    getEtapas(): ReadonlyArray<EtapaTrabalho>;
}
