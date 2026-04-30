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
    disableCheckoutIfEmpty?: boolean
    promoCode?: string
    bonusToSpend?: number
    deliveryPrice?: number
    showPromoInput?: boolean
}

const CartTotalBlock: React.FC<CartTotalBlockProps> = (
    {
        showCheckoutButton = true,
        checkoutButtonText = "К оформлению",
        onCheckoutClick,
        disableCheckoutIfEmpty = true,
        promoCode,
        bonusToSpend = 0,
        deliveryPrice = 0,
        showPromoInput = true
    }
) => {
    const items = useSelector(selectCartItems)
    const total = useSelector(selectCartTotal)
    const router = useRouter()
    const isCheckoutDisabled = disableCheckoutIfEmpty && items.length === 0

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
                            <div className={styles.label}>
                                {item.title}
                                {item.sizeTitle && <span>Размер: {item.sizeTitle}</span>}
                                {discountPercent > 0 && <span>Скидка товара: {discountPercent}%</span>}
                            </div>
                            <div className={styles.price}>
                                <span>{item.qty}</span>
                                <span>x</span>
                                {formatPrice(unitPrice)}cум
                            </div>
                        </div>
                    )
                })}
            </div>
            {showPromoInput && <div className={styles.promo_code}>
                <Input placeholder="Введите промокод..." style={{paddingLeft: 0, paddingRight: 0}} />
            </div>}
            <div className={styles.summary_rows}>
                <div className={styles.summary_row}>
                    <span>Стоимость товаров:</span>
                    <b>{formatPrice(total)}сум</b>
                </div>
                <div className={styles.summary_row}>
                    <span>Промокод:</span>
                    <b>{promoCode?.trim() || "—"}</b>
                </div>
                <div className={styles.summary_row}>
                    <span>Бонусы:</span>
                    <b>{bonusToSpend > 0 ? `-${formatPrice(bonusToSpend)}сум` : "—"}</b>
                </div>
                <div className={styles.summary_row}>
                    <span>Доставка:</span>
                    <b>{deliveryPrice > 0 ? `${formatPrice(deliveryPrice)}сум` : "Будет рассчитана"}</b>
                </div>
            </div>
            <div className={styles.total}>
                <div className={styles.label}>Всего:</div>
                <div className={styles.value}>{formatPrice(Math.max(total + deliveryPrice - bonusToSpend, 0))}сум</div>
            </div>
            {isCheckoutDisabled && (
                <div className={styles.checkout_hint}>Добавьте товары в корзину, чтобы перейти к оформлению.</div>
            )}
            {showCheckoutButton && (
                <Button
                    block
                    disabled={isCheckoutDisabled}
                    onClick={() => {
                        if (isCheckoutDisabled) return
                        onCheckoutClick ? onCheckoutClick() : router.push("/cart/checkout")
                    }}
                >
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
