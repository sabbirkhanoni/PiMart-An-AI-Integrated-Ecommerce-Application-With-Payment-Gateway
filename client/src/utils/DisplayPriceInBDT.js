 export const DisplayPriceInBDT = (price) => {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'bdt',
    }).format(price);
}