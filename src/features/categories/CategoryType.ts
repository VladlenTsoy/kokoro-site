export interface CategoryWithSubCategoriesType {
    created_at: string
    id: number
    title: string
    parent_category_id: number | null
    url: string
    is_hide: boolean | null
    sub_categories?: CategoryWithSubCategoriesType[]
}