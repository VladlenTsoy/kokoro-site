/**
 * Функция для вычисления итоговой суммы после применения скидки
 * @param {number} total - Общая сумма
 * @param {number} discount - Процент скидки
 * @return {number} - Итоговая сумма после применения скидки
 */
export function calculateDiscountedTotal(total: number, discount: number): number {
    if (total < 0 || discount < 0 || discount > 100) {
        throw new Error('Invalid input values');
    }
    const discountAmount = (total * discount) / 100;
    return total - discountAmount;
}
