export const parseQueryIds = (value: string | string[] | undefined): number[] => {
    if (!value) return []

    const raw = Array.isArray(value) ? value.join(",") : value

    return raw
        .split(",")
        .map(item => Number(item.trim()))
        .filter(item => Number.isInteger(item) && item > 0)
}

export const serializeQueryIds = (ids: number[]): string | undefined => {
    const unique = Array.from(new Set(ids.filter(item => Number.isInteger(item) && item > 0)))
    if (!unique.length) return undefined
    return unique.join(",")
}
