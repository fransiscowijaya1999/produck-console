/** 
 * @param { number } price
 * @param { number } cost
 */
export function calculateMargin(price, cost) {
    const profit = price - cost;
    const margin = (profit / price) * 100;
    const result = isNaN(margin) ? 0 : Math.floor(margin);

    return result;
}