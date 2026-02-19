import {CategoryWithSubCategoriesType} from "@/features/categories/CategoryType"

export interface CategoryTreeItem extends Omit<CategoryWithSubCategoriesType, "sub_categories" | "url"> {
    url: string
    path: string
    sub_categories: CategoryTreeItem[]
}

const normalizePathSegment = (value: string) => value.replace(/^\/+|\/+$/g, "")

const toPath = (parentPath: string, url: string) => {
    const segment = normalizePathSegment(url)
    const prefix = normalizePathSegment(parentPath)

    if (!prefix) return `/${segment}`
    if (!segment) return `/${prefix}`
    return `/${prefix}/${segment}`
}

export const buildCategoryTree = (items: CategoryWithSubCategoriesType[], parentPath = ""): CategoryTreeItem[] => {
    return items
        .filter(item => !item.is_hide)
        .map(item => {
            const path = toPath(parentPath, item.url)
            const subCategories = buildCategoryTree(item.sub_categories ?? [], path)

            return {
                ...item,
                url: item.url,
                path,
                sub_categories: subCategories
            }
        })
}

export const flattenCategoryTree = (items: CategoryTreeItem[]): CategoryTreeItem[] => {
    return items.flatMap(item => [item, ...flattenCategoryTree(item.sub_categories)])
}

export const findCategoryByPath = (items: CategoryTreeItem[], path: string): CategoryTreeItem | undefined => {
    const normalizedPath = `/${normalizePathSegment(path)}`
    return flattenCategoryTree(items).find(item => item.path === normalizedPath)
}
