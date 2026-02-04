"use client"

import React, {useMemo, useState} from "react"
import Select from "@/components/select/Select"
import Button from "@/components/button/Button"
import ProductVariantSelect from "@/features/product/ProductVariantSelect"
import getTextValue from "@/utils/getTextValue"
import {useDispatch} from "react-redux"
import {addItem} from "@/features/cart/cartSlice"
import type {SelectOption} from "@/features/product/productViewModel"
import styles from "./page.module.css"

interface ProductPurchaseControlsProps {
    productId: number
    title: string
    price: number
    image: string
    sizeOptions: SelectOption[]
    colorOptions: SelectOption[]
    colorTitle?: string
    children?: React.ReactNode
}

const ProductPurchaseControls: React.FC<ProductPurchaseControlsProps> = (
    {
        productId,
        title,
        price,
        image,
        sizeOptions,
        colorOptions,
        colorTitle,
        children
    }
) => {
    const dispatch = useDispatch()
    const resolvedSizeOptions = useMemo(
        () => sizeOptions.length ? sizeOptions : [{title: "One size", value: 0}],
        [sizeOptions]
    )
    const [selectedSize, setSelectedSize] = useState<SelectOption>(resolvedSizeOptions[0])

    const onAddToCart = () => {
        dispatch(addItem({
            productVariantId: productId,
            sizeId: typeof selectedSize.value === "number" ? selectedSize.value : null,
            qty: 1,
            price,
            title: getTextValue(title),
            image,
            sizeTitle: getTextValue(selectedSize.title),
            colorTitle: getTextValue(colorTitle)
        }))
    }

    return (
        <>
            <div className={styles.options}>
                <Select options={resolvedSizeOptions} onChange={option => setSelectedSize(option)} />
                <ProductVariantSelect options={colorOptions} />
            </div>
            {children}
            <div className={styles.actions}>
                <Button block onClick={onAddToCart}>Добавить в корзину</Button>
            </div>
        </>
    )
}

export default ProductPurchaseControls
