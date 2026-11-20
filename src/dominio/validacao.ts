export function textoObrigatorio(valor: string, campo: string): string {
    const texto: string = valor.trim();
    if(!texto){
        throw new Error(`Preencha ${campo}.`);
    }
    return texto;
}
export function dataValida(data: Date): Date {
    if(!Number.isFinite(data.getTime())){
        throw new Error("Informe uma data válida");
    }
    return new Date(data);
}