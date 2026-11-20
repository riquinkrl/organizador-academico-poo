import type { AcoesItemAcademico } from "./acoes-item";
import type { Passo } from "./tipos";

export interface AcoesAtividadePratica {
    calcularDiasRestantes(agora?: Date): number;
    listarChecklist(): Array<Passo>;
    obterLinkEntrega(): string | undefined;
    definirPasso(indice: number, feita: boolean): void;
}
