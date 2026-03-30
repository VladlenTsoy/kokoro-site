import React from "react"
import Banner from "@/components/banner/Banner"
import ProductList from "@/features/product/ProductList"
import ProductBanner from "@/features/product-banner/ProductBanner"
import type {ProductVariant, ProductVariantsResponse} from "@/features/product-variants/productVariantsApi"
import {API_BASE_URL} from "@/utils/siteConfig"

const PRODUCTS_LIMIT = 8

async function getProductVariants(limit: number): Promise<ProductVariant[]> {
    const res = await fetch(`${API_BASE_URL}/product/variants?pageSize=${limit}&sortOrder=desc`, {
        cache: "no-store"
    })

    if (!res.ok) {
        throw new Error("Failed to load product variants")
    }

    const data = (await res.json()) as ProductVariantsResponse
    return Array.isArray(data) ? data : data.items || []
}

export default async function Home() {
    const products = await getProductVariants(PRODUCTS_LIMIT)

    return (
        <main>
            <Banner title={<>FEEL YOUR<br />KOKORO</>} />
            <ProductList title={<h2>Новая<br />одежда</h2>} items={products} limit={PRODUCTS_LIMIT} />
            <ProductBanner />
            <ProductList title={<h3>Вам может<br />понравится</h3>} items={[]} limit={PRODUCTS_LIMIT} />
        </main>
    )
}
