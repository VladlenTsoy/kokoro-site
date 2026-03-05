import React from "react"
import {notFound} from "next/navigation"
import Link from "next/link"
import styles from "./page.module.css"
import {buildCategoryTree, findCategoryByPath} from "@/features/categories/categoryTree"
import {type CategoryWithSubCategoriesType} from "@/features/categories/CategoryType"
import {API_BASE_URL} from "@/utils/apiConfig"
import type {ProductVariant, ProductVariantsResponse} from "@/features/product-variants/productVariantsApi"
import ProductList from "@/features/product/ProductList"
import ProductFiltersSidebar from "@/features/product-filters/ProductFiltersSidebar"
import {parseQueryIds, serializeQueryIds} from "@/utils/queryIds"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"

interface ColorFilterOption {
    id: number
    title: string
    hex?: string | null
}

interface SizeFilterOption {
    id: number
    title: string
}

interface SearchParams {
    colorIds?: string | string[]
    sizeIds?: string | string[]
}

async function getCategories(): Promise<CategoryWithSubCategoriesType[]> {
    const res = await fetch(`${API_BASE_URL}/product/categories/with-subcategories`, {
        next: {revalidate: 60}
    })

    if (!res.ok) {
        throw new Error("Failed to load categories")
    }

    return (await res.json()) as CategoryWithSubCategoriesType[]
}

async function getProductsByCategory(categoryId: number, colorIds: number[], sizeIds: number[]): Promise<ProductVariant[]> {
    const params = new URLSearchParams({
        page: "1",
        pageSize: "24",
        sortOrder: "desc",
        categoryId: String(categoryId)
    })

    const colorQuery = serializeQueryIds(colorIds)
    const sizeQuery = serializeQueryIds(sizeIds)

    if (colorQuery) params.set("colorIds", colorQuery)
    if (sizeQuery) params.set("sizeIds", sizeQuery)

    const res = await fetch(`${API_BASE_URL}/product/variants?${params.toString()}`, {
        next: {revalidate: 60}
    })

    if (!res.ok) {
        return []
    }

    const data = (await res.json()) as ProductVariantsResponse

    if (Array.isArray(data)) return data
    return data.items || []
}

async function getColorFilters(categoryId: number): Promise<ColorFilterOption[]> {
    const params = new URLSearchParams({categoryId: String(categoryId)})
    const res = await fetch(`${API_BASE_URL}/product/variants/filters/colors?${params.toString()}`, {
        next: {revalidate: 60}
    })

    if (!res.ok) return []
    return (await res.json()) as ColorFilterOption[]
}

async function getSizeFilters(categoryId: number): Promise<SizeFilterOption[]> {
    const params = new URLSearchParams({categoryId: String(categoryId)})
    const res = await fetch(`${API_BASE_URL}/product/variants/filters/sizes?${params.toString()}`, {
        next: {revalidate: 60}
    })

    if (!res.ok) return []
    return (await res.json()) as SizeFilterOption[]
}

interface PageProps {
    params: {
        category: string[]
    }
    searchParams?: SearchParams
}

const CategoryPage = async ({params, searchParams}: PageProps) => {
    const colorIds = parseQueryIds(searchParams?.colorIds)
    const sizeIds = parseQueryIds(searchParams?.sizeIds)

    const categories = await getCategories()
    const tree = buildCategoryTree(categories)
    const path = params.category.join("/")
    const currentCategory = findCategoryByPath(tree, path)

    if (!currentCategory) notFound()

    const [products, colors, sizes] = await Promise.all([
        getProductsByCategory(currentCategory.id, colorIds, sizeIds),
        getColorFilters(currentCategory.id),
        getSizeFilters(currentCategory.id)
    ])

    return (
        <main className={styles.page}>
            <Breadcrumb items={[
                {href: "/collections", label: "Одежда"},
                {label: currentCategory.title, isCurrent: true}
            ]} />
            <h1 className={styles.title}>{currentCategory.title}</h1>

            {currentCategory.sub_categories.length > 0 && (
                <>
                    <div className={styles.subtitle}>Подкатегории</div>
                    <div className={styles.list}>
                        {currentCategory.sub_categories.map(subCategory => (
                            <Link key={subCategory.id} href={`/collections${subCategory.path}`} className={styles.link}>
                                {subCategory.title}
                            </Link>
                        ))}
                    </div>
                </>
            )}

            <div className={styles.layout}>
                <div className={styles.sidebar}>
                    <ProductFiltersSidebar colors={colors} sizes={sizes} />
                </div>
                <div className={styles.content}>
                    <ProductList title={<h2 className={styles.products_title}>Товары</h2>} items={products} />
                </div>
            </div>
        </main>
    )
}

export default CategoryPage
