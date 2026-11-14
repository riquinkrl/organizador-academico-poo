import { ItemAcademico } from "./item-academico";
import type { AcoesLembrete } from "../contratos/acoes-lembrete";

export class Lembrete extends ItemAcademico implements AcoesLembrete {
    private readonly dataAviso?: Date;
    private fixado: boolean;
    private readonly etiqueta: string;

    constructor(titulo: string, descricao: string, workspaceId: string, etiqueta: string, dataAviso?: Date, fixado: boolean = false){
        super(titulo, descricao, workspaceId);
        this.etiqueta = ItemAcademico.validarTextoObrigatorio(etiqueta, "A etiqueta não pode ser vazia.");
        this.dataAviso = Lembrete.validarDataAviso(dataAviso);
        this.fixado = fixado;
    }

    private static validarDataAviso(data?: Date): Date | undefined {
        if(data === undefined){
            return undefined;
        }
        return ItemAcademico.validarEClonarData(data, "Data do aviso inválida.");
    }

    obterCategoria(): string {
        return "Lembrete";
    }

    estaPendente(agora?: Date): boolean {
        const dataReferencia: Date = ItemAcademico.obterDataReferencia(agora);

        return this.dataAviso !== undefined && this.dataAviso.getTime() > dataReferencia.getTime();
    }

    obterExibicaoFormatada(): string {
        let texto: string = `${this.getTitulo()} - ${this.etiqueta}`;

        if(this.dataAviso){
            texto += ` (aviso: ${this.dataAviso.toLocaleDateString("pt-BR")})`;
        }
        if(this.fixado){
            texto += " [fixado]";
        }
        return texto;
    }

    override estaFixado(): boolean {
        return this.fixado;
    }

    alternarFixacao(): void {
        this.fixado = !this.fixado;
    }

    getDataAviso(): Date | undefined {
        if(!this.dataAviso){
            return undefined;
        }
        return new Date(this.dataAviso.getTime());
    }

    getEtiqueta(): string {
        return this.etiqueta;
    }
}