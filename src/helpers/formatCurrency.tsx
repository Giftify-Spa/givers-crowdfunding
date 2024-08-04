export const formattingToCLP = (value: string) => {
    return Number(value).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP'
    })
}

export const formattingToCLPNumber = (value: number) => {
    return Number(value).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP'
    })
}