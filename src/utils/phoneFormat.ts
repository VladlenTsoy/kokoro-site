export const getUzbekistanLocalDigits = (value: string) => {
    const digits = value.replace(/\D/g, "")
    const hasExplicitPlusPrefix = value.trim().startsWith("+")

    if (hasExplicitPlusPrefix) {
        if (!digits.startsWith("998")) return ""
        return digits.slice(3, 12)
    }

    if (digits.startsWith("998")) return digits.slice(3, 12)
    if (digits.startsWith("0")) return digits.slice(1, 10)
    return digits.slice(0, 9)
}

export const formatUzbekistanPhone = (local: string) => {
    let formatted = "+998"

    if (local.length > 0) {
        formatted += ` (${local.slice(0, 2)}`
    }
    if (local.length > 2) {
        formatted += ")"
    }
    if (local.length > 2) {
        formatted += ` ${local.slice(2, 5)}`
    }
    if (local.length > 5) {
        formatted += `-${local.slice(5, 7)}`
    }
    if (local.length > 7) {
        formatted += `-${local.slice(7, 9)}`
    }

    return formatted
}

export const isUzbekistanPhoneValid = (local: string) => local.length === 9

export const toUzbekistanE164 = (local: string) => `+998${local}`
