import React from "react"
import ProductList from "@/features/product/ProductList"
import type {ProductVariant, ProductVariantsResponse} from "@/features/product-variants/productVariantsApi"
import {API_BASE_URL} from "@/utils/apiConfig"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import styles from "./page.module.css"

interface SearchPageParams {
    q?: string
}

async function searchProducts(query: string): Promise<ProductVariant[]> {
    if (!query.trim()) return []

    const params = new URLSearchParams({
        page: "1",
        pageSize: "24",
        sortOrder: "newest",
        search: query.trim()
    })

    const res = await fetch(`${API_BASE_URL}/product/variants?${params.toString()}`, {
        next: {revalidate: 30}
    })

    if (!res.ok) return []

    const data = (await res.json()) as ProductVariantsResponse
    if (Array.isArray(data)) return data
    return data.items || []
}

const SearchPage = async ({searchParams}: {searchParams?: SearchPageParams}) => {
    const query = searchParams?.q?.trim() || ""
    const products = await searchProducts(query)

    return (
        <main className={styles.page}>
            <Breadcrumb items={[{href: "/collections", label: "Одежда"}, {label: "Поиск", isCurrent: true}]} />
            <h1 className={styles.title}>Поиск</h1>
            <p className={styles.subtitle}>
                {query ? `Результаты по запросу “${query}”` : "Введите запрос в поле поиска."}
            </p>
            {query && products.length > 0 && (
                <ProductList title={<h2 className={styles.products_title}>Найдено товаров: {products.length}</h2>} items={products} />
            )}
            {query && products.length === 0 && (
                <div className={styles.empty}>По запросу “{query}” ничего не найдено.</div>
            )}
        </main>
    )
}

export default SearchPage
