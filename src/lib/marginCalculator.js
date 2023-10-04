/** 
 * @param { number } price
 * @param { number } cost
 */
export function calculateMargin(price, cost) {
    const profit = price - cost;
    const margin = profit <= 0 ? (profit / cost) * 100 : (profit / price) * 100;
    const result = isNaN(margin) ? 0 : Math.floor(margin);

    return result;
}

export function displayMargin(price, cost) {
    const margin = calculateMargin(price, cost);

    let displayed = margin.toString();
    if (margin > 0) displayed = `<span class="badge text-bg-success">+${margin}%</span>`;
    if (margin <= 0) displayed = `<span class="badge text-bg-danger">${margin}%</span>`;

    return displayed;
}