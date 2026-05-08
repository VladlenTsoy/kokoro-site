"use client"

import React, {useEffect, useMemo, useState} from "react"
import Select from "@/components/select/Select"
import Button from "@/components/button/Button"
import ProductVariantSelect from "@/features/product/ProductVariantSelect"
import getTextValue from "@/utils/getTextValue"
import {useDispatch} from "react-redux"
import {addItem} from "@/features/cart/cartSlice"
import type {SelectOption} from "@/features/product/productViewModel"
import styles from "./ProductPurchaseControls.module.css"

interface ProductPurchaseControlsProps {
    productId: number
    title: string
    price: number
    image: string
    sizeOptions: SelectOption[]
    colorOptions: SelectOption[]
    colorTitle?: string
    discountPercent?: number
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
        discountPercent,
        children
    }
) => {
    const dispatch = useDispatch()
    const resolvedSizeOptions = useMemo(
        () => sizeOptions.length ? sizeOptions : [{title: "One size", value: 0}],
        [sizeOptions]
    )
    const firstAvailableSize = resolvedSizeOptions.find(option => !option.disabled) ?? resolvedSizeOptions[0]
    const [selectedSize, setSelectedSize] = useState<SelectOption>(firstAvailableSize)
    const isSelectedSizeUnavailable = Boolean(selectedSize?.disabled)
    const isProductUnavailable = resolvedSizeOptions.every(option => option.disabled)

    useEffect(() => {
        setSelectedSize(firstAvailableSize)
    }, [firstAvailableSize])

    const onAddToCart = () => {
        if (isSelectedSizeUnavailable || isProductUnavailable) return
        dispatch(addItem({
            productVariantId: productId,
            sizeId: typeof selectedSize.value === "number" ? selectedSize.value : null,
            qty: 1,
            price,
            title: getTextValue(title),
            image,
            sizeTitle: getTextValue(selectedSize.title),
            colorTitle: getTextValue(colorTitle),
            discountPercent
        }))
        window.scrollTo({top: 0, behavior: "smooth"})
    }

    return (
        <>
            <div className={styles.options}>
                <Select options={resolvedSizeOptions} onChange={option => setSelectedSize(option)} />
                <ProductVariantSelect options={colorOptions} />
            </div>
            {children}
            <div className={styles.actions}>
                <Button block disabled={isSelectedSizeUnavailable || isProductUnavailable} onClick={onAddToCart}>
                    {isProductUnavailable ? "Нет в наличии" : "Добавить в корзину"}
                </Button>
            </div>
        </>
    )
}

export default ProductPurchaseControls
