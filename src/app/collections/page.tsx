import React from "react"
import ProductList from "@/features/product/ProductList"
import type {ProductVariant, ProductVariantsResponse} from "@/features/product-variants/productVariantsApi"
import {API_BASE_URL} from "@/utils/apiConfig"
import styles from "./page.module.css"
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

async function getAllProducts(colorIds: number[], sizeIds: number[]): Promise<ProductVariant[]> {
    const params = new URLSearchParams({
        page: "1",
        pageSize: "24",
        sortOrder: "desc"
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

async function getColorFilters(): Promise<ColorFilterOption[]> {
    const res = await fetch(`${API_BASE_URL}/product/variants/filters/colors`, {
        next: {revalidate: 60}
    })

    if (!res.ok) return []
    return (await res.json()) as ColorFilterOption[]
}

async function getSizeFilters(): Promise<SizeFilterOption[]> {
    const res = await fetch(`${API_BASE_URL}/product/variants/filters/sizes`, {
        next: {revalidate: 60}
    })

    if (!res.ok) return []
    return (await res.json()) as SizeFilterOption[]
}

const CollectionsPage = async ({searchParams}: {searchParams?: SearchParams}) => {
    const colorIds = parseQueryIds(searchParams?.colorIds)
    const sizeIds = parseQueryIds(searchParams?.sizeIds)

    const [products, colors, sizes] = await Promise.all([
        getAllProducts(colorIds, sizeIds),
        getColorFilters(),
        getSizeFilters()
    ])

    return (
        <main className={styles.page}>
            <Breadcrumb items={[{label: "Одежда", isCurrent: true}]} />
            <h1 className={styles.title}>Одежда</h1>
            <div className={styles.layout}>
                <div className={styles.sidebar}>
                    <ProductFiltersSidebar colors={colors} sizes={sizes} />
                </div>
                <div className={styles.content}>
                    <ProductList title={<h2 className={styles.products_title}>Все товары</h2>} items={products} />
                </div>
            </div>
        </main>
    )
}

export default CollectionsPage
