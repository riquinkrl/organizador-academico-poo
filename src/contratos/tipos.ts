export type Origem = "PROFESSOR" | "AUTOESTUDO";

export type RegistroItemAcademico = {
    id: string;
    dataCriacao: Date;
};

export type Passo = {
    descricao: string;
    feita: boolean;
}

export type Etapa = {
    titulo: string;
    responsavel: string;
    entregue: boolean;
};

export type Filtro = "todos" | "pendentes" | "concluidas" | "fixados";
export type Ordem = "prazo" | "cadastro" | "origem";