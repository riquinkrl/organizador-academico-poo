import { ItemAcademico } from "./item-academico";
import type { AcoesLembrete } from "../contratos/acoes-lembre";
export class Lembrete extends ItemAcademico implements AcoesLembrete {
   private readonly dataAviso?: Date;
   private fixado: boolean = false;
   private etiqueta: string;
   
    constructor(titulo: string, descricao: string, workspaceId: string, etiqueta: string, dataAviso?: Date){
    
        super(titulo, descricao, workspaceId);
        this.etiqueta = Lembrete.validarEtiqueta(etiqueta);

        if(dataAviso){
            if(!Number.isNaN(dataAviso.getTime())){
                this.dataAviso = new Date(dataAviso.getTime());
            } else {
                throw new Error("Data do aviso inválida. ");
            }
        } else {
            this.dataAviso = undefined;
        }

        }
    

    private static validarEtiqueta(etiqueta: string): string {
            const limpa: string = etiqueta.trim();

            if(limpa === ""){
                throw new Error("A etiqueta não pode ser vazia. ");
            }
            return limpa;
    }

    obterCategoria(): string {
        return "Lembrete";
    }

    estaPendente(agora?: Date): boolean {
        let dataReferencia: Date;

        if(agora){
            dataReferencia = agora;
        } else {
            dataReferencia = new Date();
        }

        if(this.dataAviso && this.dataAviso.getTime() > dataReferencia.getTime()){
            return true;
        } else {
            return false;
        }
    }

    obterExibicaoFormatada(): string {
        let texto: string = `${this.getTitulo()}\n${this.etiqueta}`;

        if(this.dataAviso){
            texto += `(aviso: ${this.dataAviso.toLocaleDateString("pt-BR")})`;
        }

        if(this.fixado){
            texto += "[fixado]";
        }
        return texto;
    }

    estaFixado(): boolean {
        return this.fixado;
    }

    alternarFixacao(): void{
        this.fixado = !this.fixado;
    }

    getDataAviso(): Date | undefined {
        if(this.dataAviso){
            return new Date(this.dataAviso.getTime());
        } else {
            return undefined;
        }

    }

    getFixado(): boolean {
        return this.fixado;
    }

    getEtiqueta(): string {
        return this.etiqueta;
    }
}