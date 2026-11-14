export type Origem = "PROFESSOR" | "AUTOESTUDO"

export type SubtarefaChecklist = {
    descricao: string;
    feita: boolean;
}

export interface AcoesAtividadePratica {
    marcarComoConcluida(agora?: Date):void;
    verificarSeAtrasada(agora?: Date):boolean;
    calcularDiasRestantes(agora?: Date): number;
    adicionarSubtarefa(descricao: string): void;
    alternarSubtarefa(indice: number): void;
    removerSubtarefa(indice: number):void;
    reabrirAtividade():void;
    atualizarLinkEntrega(novoLink: string):void;
    calcularProgressoChecklist():number;
}