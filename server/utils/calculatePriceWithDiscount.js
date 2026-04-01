export const calculatePriceWithDiscount = (price, discount=1) => {
    const discountAmnt = Math.ceil((Number(price) * Number(discount)) / 100);
    const finalPrice = Number(price) - Number(discountAmnt);
    return finalPrice;
}