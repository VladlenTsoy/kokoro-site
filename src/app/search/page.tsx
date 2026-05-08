import React from "react"
import Link from "next/link"
import ProductList from "@/features/product/ProductList"
import type {ProductVariant, ProductVariantsResponse} from "@/features/product-variants/productVariantsApi"
import {API_BASE_URL} from "@/utils/apiConfig"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import styles from "./page.module.css"

interface SearchPageParams {
    q?: string
}

const RECOVERY_LINKS = [
    {href: "/collections", label: "Все товары"},
    {href: "/collections?sortBy=newest", label: "Новинки"},
    {href: "/collections?sortBy=price_asc", label: "Сначала дешевле"},
    {href: "/collections?sortBy=price_desc", label: "Сначала дороже"}
]

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

async function getSuggestedProducts(): Promise<ProductVariant[]> {
    const res = await fetch(`${API_BASE_URL}/product/variants/new-arrivals?limit=4`, {
        next: {revalidate: 60}
    })

    if (!res.ok) return []
    return (await res.json()) as ProductVariant[]
}

async function recordZeroResultSearch(query: string) {
    if (!query.trim()) return

    try {
        await fetch(`${API_BASE_URL}/search-zero-results`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({query: query.trim()}),
            cache: "no-store"
        })
    } catch {
        // Do not break search UX if analytics logging is temporarily unavailable.
    }
}

const SearchPage = async ({searchParams}: {searchParams?: SearchPageParams}) => {
    const query = searchParams?.q?.trim() || ""
    const products = await searchProducts(query)
    const isZeroResult = Boolean(query && products.length === 0)
    const suggestedProducts = isZeroResult ? await getSuggestedProducts() : []

    if (isZeroResult) {
        await recordZeroResultSearch(query)
    }

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
            {isZeroResult && (
                <div className={styles.zero_result}>
                    <div className={styles.empty}>По запросу “{query}” ничего не найдено.</div>
                    <section className={styles.recovery}>
                        <h2 className={styles.recovery_title}>Попробуйте посмотреть</h2>
                        <div className={styles.recovery_links}>
                            {RECOVERY_LINKS.map(link => (
                                <Link key={link.href} href={link.href} className={styles.recovery_link}>{link.label}</Link>
                            ))}
                        </div>
                        {suggestedProducts.length > 0 && (
                            <ProductList title={<h3 className={styles.products_title}>Новинки каталога</h3>} items={suggestedProducts} />
                        )}
                    </section>
                </div>
            )}
        </main>
    )
}

export default SearchPage
