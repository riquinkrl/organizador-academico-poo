export type EtapaTrabalho = {
    titulo: string;
    responsavel: string;
    entregue: boolean;
};

export interface AcoesTrabalhoEmGrupo {
    adicionarColega(nome: string): void;
    removerColega(indice: number): void;
    adicionarEtapa(titulo: string, responsavel: string): void;
    marcarEtapaComoEntregue(indice: number): void;
    calcularProgressoEquipe(): number;
    calcularDiasRestantes(agora?: Date): number;
}