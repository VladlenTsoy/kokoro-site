import React from "react"
import Link from "next/link"
import Banner from "@/components/banner/Banner"
import ProductList from "@/features/product/ProductList"
import ProductBanner from "@/features/product-banner/ProductBanner"
import type {ProductVariant} from "@/features/product-variants/productVariantsApi"
import {API_BASE_URL} from "@/utils/siteConfig"
import ImageBlock from "@/components/image-block/ImageBlock"
import styles from "./page.module.css"

const PRODUCTS_LIMIT = 12

interface ProductCollection {
    id: number
    title: string
    productsCount: number
    coverImageUrl: string | null
}

async function getJson<T>(path: string): Promise<T | null> {
    try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            cache: "no-store"
        })

        if (!res.ok) {
            return null
        }

        return (await res.json()) as T
    } catch {
        return null
    }
}

async function getCollections(): Promise<ProductCollection[]> {
    const data = await getJson<ProductCollection[]>("/product/collections")
    return Array.isArray(data) ? data : []
}

async function getShowcaseVariants(path: string): Promise<ProductVariant[]> {
    const data = await getJson<ProductVariant[]>(`${path}?limit=${PRODUCTS_LIMIT}`)
    return Array.isArray(data) ? data : []
}

const CollectionsSection = ({items}: {items: ProductCollection[]}) => {
    if (items.length === 0) return null

    return (
        <section className={styles.collections}>
            <div className={styles.section_header}>
                <h2>Коллекции</h2>
                <Link href="/collections" className={styles.section_link}>Все коллекции</Link>
            </div>
            <div className={styles.collections_grid}>
                {items.map(item => (
                    <Link href={`/collections?collectionId=${item.id}`} className={styles.collection_card} key={item.id}>
                        <div className={styles.collection_image}>
                            <ImageBlock
                                src={item.coverImageUrl || "/images/about.png"}
                                alt={item.title}
                                fill
                            />
                        </div>
                        <div className={styles.collection_body}>
                            <h3>{item.title}</h3>
                            <span>{item.productsCount} товаров</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default async function Home() {
    const [
        collections,
        newArrivals,
        bestsellers,
        discounted
    ] = await Promise.all([
        getCollections(),
        getShowcaseVariants("/product/variants/new-arrivals"),
        getShowcaseVariants("/product/variants/bestsellers"),
        getShowcaseVariants("/product/variants/discounted")
    ])

    return (
        <main>
            <Banner title={<>FEEL YOUR<br />KOKORO</>} />
            <CollectionsSection items={collections} />
            <ProductList title={<h2>Новые<br />поступления</h2>} items={newArrivals} limit={PRODUCTS_LIMIT} />
            <ProductBanner />
            <ProductList title={<h3>Бестселлеры</h3>} items={bestsellers} limit={PRODUCTS_LIMIT} />
            <ProductList title={<h3>Скидки</h3>} items={discounted} limit={PRODUCTS_LIMIT} />
        </main>
    )
}
