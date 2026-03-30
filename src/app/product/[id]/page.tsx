import React from "react"
import type {Metadata} from "next"
import {notFound} from "next/navigation"
import styles from "./page.module.css"
import ImageGallery from "@/components/image-gallery/ImageGallery"
import Container from "@/layouts/container/Container"
import ProductPrice from "@/components/product-price/ProductPrice"
import type {ProductVariant} from "@/features/product-variants/productVariantsApi"
import getTextValue from "@/utils/getTextValue"
import MeasurementsTable from "@/features/product/MeasurementsTable"
import {mapColorOptions, mapImages, mapSizeOptions} from "@/features/product/productViewModel"
import ProductPurchaseControls from "@/features/product/ProductPurchaseControls"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import {API_BASE_URL} from "@/utils/apiConfig"
import ProductDetailsCollapse from "@/features/product/ProductDetailsCollapse"
import {SITE_URL} from "@/utils/siteConfig"
const PRODUCT_REVALIDATE_SECONDS = 10

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()

const resolveProductDescription = (product: ProductVariant) => {
    const firstProperty = product.product?.properties?.[0]?.description
    if (firstProperty) return stripHtml(getTextValue(firstProperty))
    return `${getTextValue(product.title)} от KOKORO`
}

async function getProductVariant(id: string): Promise<ProductVariant> {
    const res = await fetch(`${API_BASE_URL}/product/variants/${id}`, {
        next: {revalidate: PRODUCT_REVALIDATE_SECONDS}
    })

    if (!res.ok) notFound()

    const data = (await res.json()) as ProductVariant | null
    if (!data) notFound()

    return data
}

async function getProductVariantForMetadata(id: string): Promise<ProductVariant | null> {
    const res = await fetch(`${API_BASE_URL}/product/variants/${id}`, {
        next: {revalidate: PRODUCT_REVALIDATE_SECONDS}
    })

    if (!res.ok) return null

    const data = (await res.json()) as ProductVariant | null
    if (!data) return null

    return data
}

export async function generateMetadata({params}: {params: {id: string}}): Promise<Metadata> {
    const product = await getProductVariantForMetadata(params.id)
    if (!product) {
        return {
            title: "Товар не найден | KOKORO",
            robots: {index: false, follow: false}
        }
    }

    const title = `${getTextValue(product.title)} | KOKORO`
    const description = resolveProductDescription(product)
    const imageUrl = product.images?.[0]?.path
    const canonical = `${SITE_URL}/product/${params.id}`

    return {
        title,
        description,
        alternates: {
            canonical
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: canonical,
            images: imageUrl ? [{url: imageUrl}] : undefined
        },
        twitter: {
            card: imageUrl ? "summary_large_image" : "summary",
            title,
            description,
            images: imageUrl ? [imageUrl] : undefined
        }
    }
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
            <Breadcrumb items={[
                {href: "/collections", label: "Одежда"},
                {label: getTextValue(product.title), isCurrent: true}
            ]} />
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
                            image={images[0]?.url}
                            sizeOptions={sizeOptions}
                            colorOptions={colorOptions}
                            colorTitle={product.color?.title}
                            discountPercent={product?.discount?.discountPercent ? Number(product.discount.discountPercent) : undefined}
                        >
                            <div className={styles.tabs}>
                                <ProductDetailsCollapse items={tabs} />
                            </div>
                        </ProductPurchaseControls>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Page

export const revalidate = PRODUCT_REVALIDATE_SECONDS
