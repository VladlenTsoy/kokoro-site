import React from "react"
import {notFound} from "next/navigation"
import styles from "./page.module.css"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import ImageGallery from "@/components/image-gallery/ImageGallery"
import Tabs from "@/components/tabs/Tabs"
import Container from "@/layouts/container/Container"
import ProductPrice from "@/components/product-price/ProductPrice"
import type {ProductVariant} from "@/features/product-variants/productVariantsApi"
import getTextValue from "@/utils/getTextValue"
import MeasurementsTable from "@/features/product/MeasurementsTable"
import {mapColorOptions, mapImages, mapSizeOptions} from "@/features/product/productViewModel"
import ProductPurchaseControls from "./ProductPurchaseControls"

async function getProductVariant(id: string): Promise<ProductVariant> {
    const res = await fetch(`http://localhost:3000/api/product/variants/${id}`, {
        next: {revalidate: 10}
        // cache: "no-store"
    })

    if (!res.ok) notFound()

    const data = (await res.json()) as ProductVariant | null
    if (!data) notFound()

    return data
}

const Page = async ({params}: {params: {id: string}}) => {
    const product = await getProductVariant(params.id)

    const images = mapImages(product.images)
    const sizeOptions = mapSizeOptions(product.sizes)
    const colorOptions = mapColorOptions(product)

    const propertyTabs = product.product?.properties?.map(property => ({
        label: getTextValue(property.title),
        content: <div dangerouslySetInnerHTML={{__html: getTextValue(property.description)}} />
    })) ?? []

    const measurementTabs = product.measurements?.length
        ? [{
            label: "Таблица размеров",
            content: <MeasurementsTable measurements={product.measurements} sizes={product.sizes} />
        }]
        : []

    const tabs = [...propertyTabs, ...measurementTabs]

    return (
        <Container>
            <Breadcrumb />
            <div className={styles.container}>
                <ImageGallery images={images} />
                <div className={styles.details}>
                    <div className={styles.sticky}>
                        <div className={styles.product_header}>
                            <h1 className={styles.title}>{getTextValue(product.title)}</h1>
                            <ProductPrice
                                price={product.price}
                                discount={product?.discount?.discountPercent ? Number(product?.discount?.discountPercent) : undefined}
                            />
                        </div>
                        <div className={styles.description}>
                            Мягко прилегающая к телу зип-худи создан из высококачественного хлопка. Вместительный
                            основной карман скрывает внутри несколько маленьких карманов для хранения мелочи, ключей или
                            телефона. Свободный крой позволит вам оставаться активным даже в прохладную погоду.
                        </div>
                        <ProductPurchaseControls
                            productId={product.id}
                            title={product.title}
                            price={product.price}
                            image={images[0]?.url || "/images/t-shirt.png"}
                            sizeOptions={sizeOptions}
                            colorOptions={colorOptions}
                            colorTitle={product.color?.title}
                        >
                            <div className={styles.tabs}>
                                <Tabs tabs={tabs} />
                            </div>
                        </ProductPurchaseControls>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Page

export const revalidate = 10
