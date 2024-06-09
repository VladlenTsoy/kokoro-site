export function formatPrice(price: number): string {
    // Преобразуем число в строку и разделяем на целую и дробную части (если есть)
    let [integerPart, decimalPart] = price.toString().split(".")

    // Используем регулярное выражение для добавления пробелов
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")

    // Соединяем обратно целую и дробную части (если есть)
    if (decimalPart) {
        return `${integerPart}.${decimalPart}`
    } else {
        return integerPart
    }
}
