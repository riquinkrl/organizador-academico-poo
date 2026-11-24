import type { AcoesItemAcademico } from "../contratos/acoes-item";

export class Workspace {
    private readonly itens: Array<AcoesItemAcademico> = new Array<AcoesItemAcademico>();

    constructor(public readonly codigo: string, public readonly nome: string,public readonly professor: string, public readonly salaOuLink?: string, public readonly horario?: string){
        
    }
}