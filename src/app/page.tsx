import React from "react"
import Banner from "@/components/banner/Banner"
import ProductList from "@/features/product/ProductList"
import ProductBanner from "@/features/product-banner/ProductBanner"
import Footer from "@/layouts/footer/Footer"

export default function Home() {
    return (
        <main>
            <Banner title={<>FEEL YOUR<br />KOKORO</>} />
            <ProductList title={<>Новая<br />коллекция</>} />
            <ProductBanner />
            <ProductList title={<>Вам может<br />понравится</>} />
        </main>
    )
}
