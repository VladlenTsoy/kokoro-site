import React from "react"
import Banner from "@/components/banner/Banner"
import ProductList from "@/features/product/ProductList"
import ProductBanner from "@/features/product-banner/ProductBanner"

export default function Home() {
    return (
        <main>
            <Banner title={<>FEEL YOUR<br />KOKORO</>} />
            <ProductList title={<h2>Новая<br />коллекция</h2>} />
            <ProductBanner />
            <ProductList title={<h3>Вам может<br />понравится</h3>} />
        </main>
    )
}


