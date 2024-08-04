


export const calculatePercentage = (total: number, value: number) => {
    const percentage = (value * 100) / total;
    return percentage.toFixed(2);
}

export const calculatePercentageString = (total: string, value: string): number => {
    const percentage = (parseFloat(value) * 100) / parseFloat(total);
    return parseFloat(percentage.toFixed(2));
};