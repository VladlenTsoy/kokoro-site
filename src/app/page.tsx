import Banner from "@/components/banner/Banner"
import ProductList from "@/features/product/ProductList"
import ProductBanner from "@/features/product-banner/ProductBanner"
import React from "react"

export default function Home() {
    return (
        <main>
            <Banner title={<>FEEL YOUR<br />KOKORO</>} />
            <ProductList />
            <ProductBanner />
        </main>
    )
}
