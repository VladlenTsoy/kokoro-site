"use client"

import {useEffect, useMemo, useState} from "react"
import {API_BASE_URL} from "@/utils/apiConfig"
import type {CartItem} from "@/features/cart/cartSlice"
import type {ProductVariant} from "@/features/product-variants/productVariantsApi"

export interface CartAvailabilityIssue {
    itemId: string
    message: string
}

const getAvailableQty = (variant: ProductVariant, sizeId: number | null) => {
    if (!variant.sizes?.length) return Number.MAX_SAFE_INTEGER
    if (!sizeId) return 0

    const selectedSize = variant.sizes.find(item => item.size.id === sizeId || item.id === sizeId)
    if (!selectedSize) return 0

    return Math.max(Number(selectedSize.qty || 0) - Number(selectedSize.reservedQty || 0), 0)
}

export const useCartAvailability = (items: CartItem[]) => {
    const [issues, setIssues] = useState<CartAvailabilityIssue[]>([])
    const [isCheckingAvailability, setCheckingAvailability] = useState(false)
    const variantIds = useMemo(
        () => Array.from(new Set(items.map(item => item.productVariantId))).sort((a, b) => a - b),
        [items]
    )

    useEffect(() => {
        let isCancelled = false

        const checkAvailability = async () => {
            if (!items.length) {
                setIssues([])
                return
            }

            setCheckingAvailability(true)
            try {
                const variants = await Promise.all(
                    variantIds.map(async id => {
                        const response = await fetch(`${API_BASE_URL}/product/variants/${id}`, {cache: "no-store"})
                        if (!response.ok) return null
                        return response.json() as Promise<ProductVariant>
                    })
                )
                if (isCancelled) return

                const variantById = new Map(
                    variants.filter(Boolean).map(variant => [variant!.id, variant!])
                )
                const nextIssues = items.flatMap(item => {
                    const variant = variantById.get(item.productVariantId)
                    if (!variant) {
                        return [{itemId: item.id, message: "Товар больше недоступен."}]
                    }

                    const availableQty = getAvailableQty(variant, item.sizeId)
                    if (availableQty <= 0) {
                        return [{itemId: item.id, message: "Выбранный размер больше недоступен."}]
                    }
                    if (availableQty < item.qty) {
                        return [{itemId: item.id, message: `Доступно только ${availableQty} шт. Измените количество.`}]
                    }

                    return []
                })
                setIssues(nextIssues)
            } catch {
                if (!isCancelled) setIssues([])
            } finally {
                if (!isCancelled) setCheckingAvailability(false)
            }
        }

        void checkAvailability()

        return () => {
            isCancelled = true
        }
    }, [items, variantIds])

    return {
        issues,
        issueByItemId: new Map(issues.map(issue => [issue.itemId, issue.message])),
        hasUnavailableItems: issues.length > 0,
        isCheckingAvailability
    }
}
