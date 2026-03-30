"use client"

import React from "react"
import styles from "./CartTotalBlock.module.css"
import Button from "@/components/button/Button"
import {formatPrice} from "@/utils/formatPrice"
import Input from "@/components/input/Input"
import {useSelector} from "react-redux"
import {selectCartItems, selectCartTotal} from "@/features/cart/cartSlice"
import {calculateDiscountedTotal} from "@/utils/calculateDiscountedTotal"
import {useRouter} from "next/navigation"

interface CartTotalBlockProps {
    showCheckoutButton?: boolean
    checkoutButtonText?: string
    onCheckoutClick?: () => void
}

const CartTotalBlock: React.FC<CartTotalBlockProps> = (
    {
        showCheckoutButton = true,
        checkoutButtonText = "К оформлению",
        onCheckoutClick
    }
) => {
    const items = useSelector(selectCartItems)
    const total = useSelector(selectCartTotal)
    const router = useRouter()

    return (
        <div className={styles.container}>
            <h5 className={styles.title}>Ваша корзина:</h5>
            <div className={styles.product_list}>
                {items.map(item => {
                    const discountPercent = typeof item.discountPercent === "number" ? item.discountPercent : 0
                    const unitPrice = discountPercent > 0
                        ? calculateDiscountedTotal(item.price, discountPercent)
                        : item.price

                    return (
                        <div className={styles.product_item} key={item.id}>
                            <div className={styles.label}>{item.title}</div>
                            <div className={styles.price}>
                                <span>{item.qty}</span>
                                <span>x</span>
                                {formatPrice(unitPrice)}cум
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={styles.promo_code}>
                <Input placeholder="Введите промокод..." style={{paddingLeft: 0, paddingRight: 0}} />
            </div>
            <div className={styles.total}>
                <div className={styles.label}>Всего:</div>
                <div className={styles.value}>{formatPrice(total)}сум</div>
            </div>
            {showCheckoutButton && (
                <Button block onClick={() => (onCheckoutClick ? onCheckoutClick() : router.push("/cart/checkout"))}>
                    {checkoutButtonText}
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 7.90674L28.0933 16.0001L20 24.0934" stroke="white" strokeWidth="2"
                              strokeMiterlimit="10" strokeLinecap="square" strokeLinejoin="round" />
                        <path d="M4.66406 16H27.1041" stroke="white" strokeWidth="2" strokeMiterlimit="10"
                              strokeLinecap="square" strokeLinejoin="round" />
                    </svg>
                </Button>
            )}
        </div>
    )
}

export default CartTotalBlock
