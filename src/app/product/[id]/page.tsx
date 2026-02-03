import React from "react"
import {notFound} from "next/navigation"
import styles from "./page.module.css"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import ImageGallery from "@/components/image-gallery/ImageGallery"
import Select from "@/components/select/Select"
import Tabs from "@/components/tabs/Tabs"
import Button from "@/components/button/Button"
import Container from "@/layouts/container/Container"
import ProductPrice from "@/components/product-price/ProductPrice"
import type {ProductVariant} from "@/features/product-variants/productVariantsApi"
import ProductVariantSelect from "@/features/product/ProductVariantSelect"
import getTextValue from "@/utils/getTextValue"

async function getProductVariant(id: string): Promise<ProductVariant> {
    const res = await fetch(`http://localhost:3000/api/product/variants/${id}`, {
        // next: {revalidate: 10}
        cache: "no-store"
    })

    if (!res.ok) notFound()

    const data = (await res.json()) as ProductVariant | null
    if (!data) notFound()

    return data
}

const Page = async ({params}: {params: {id: string}}) => {
    const product = await getProductVariant(params.id)

    const images = product.images?.length
        ? product.images.map(image => ({
            id: image.id,
            url: image.path
        }))
        : []

    const sizeOptions = product.sizes?.length
        ? product.sizes.map(item => ({
            title: getTextValue(item.size.title),
            value: item.id
        }))
        : []

    const sizeTitleById = new Map<number, string>(
        product.sizes?.map(item => [item.size.id, getTextValue(item.size.title)]) ?? []
    )

    const measurementSizeIds = new Set<number>()
    product.measurements?.forEach(item => {
        if (item.descriptions && typeof item.descriptions === "object") {
            Object.keys(item.descriptions as Record<string, unknown>).forEach(key => {
                const id = Number(key)
                if (!Number.isNaN(id)) measurementSizeIds.add(id)
            })
        }
    })

    const measurementColumns = Array.from(measurementSizeIds)
        .sort((a, b) => a - b)
        .map(id => ({
            id,
            title: sizeTitleById.get(id) || String(id)
        }))

    const colorOptions = product.color
        ? [
            {
                color: product.color.hex,
                title: getTextValue(product.color.title),
                value: product.id
            },
            ...(product.related_variants ?? []).map(variant => ({
                color: variant.color.hex,
                title: getTextValue(variant.color.title),
                value: variant.id
            }))
        ]
        : []

    const measurementsContent = product.measurements?.length
        ? (
            <table>
                <thead>
                <tr>
                    <th />
                    {measurementColumns.map(column => (
                        <th key={column.id}>{column.title}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {product.measurements.map(item => (
                    <tr key={item.id}>
                        <td>{getTextValue(item.title)}</td>
                        {measurementColumns.map(column => (
                            <td key={column.id}>
                                {getTextValue(item.descriptions?.[String(column.id)])}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        )
        : "Нет данных"

    const tabs = [
        ...(product?.product?.properties.map(property => ({
            label: property.title,
            content: <div dangerouslySetInnerHTML={{__html: property.description}} />
        }))),
        {
            label: "Обмеры",
            content: measurementsContent
        }
    ]

    return (
        <Container>
            <Breadcrumb />
            <div className={styles.container}>
                <ImageGallery images={images} />
                <div className={styles.details}>
                    <div className={styles.sticky}>
                        <div className={styles.product_header}>
                            <h1 className={styles.title}>{getTextValue(product.title)}</h1>
                            <ProductPrice price={product.price} />
                        </div>
                        <div className={styles.description}>
                            {getTextValue(product.measurements?.[0]?.descriptions?.[String(sizeOptions[0]?.value)] ?? "")}
                        </div>
                        <div className={styles.options}>
                            <Select options={sizeOptions} />
                            <ProductVariantSelect options={colorOptions} />
                        </div>
                        <div className={styles.tabs}>
                            <Tabs tabs={tabs} />
                        </div>
                        <div className={styles.actions}>
                            <Button block>Добавить в корзину</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Page

export const revalidate = 10
