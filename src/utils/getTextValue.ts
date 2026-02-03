const getTextValue = (value: unknown): string => {
    if (typeof value === "string") return value
    if (value && typeof value === "object") {
        const firstString = Object.values(value as Record<string, unknown>).find(
            item => typeof item === "string"
        )
        if (typeof firstString === "string") return firstString
    }
    if (value === null || value === undefined) return ""
    return String(value)
}

export default getTextValue
