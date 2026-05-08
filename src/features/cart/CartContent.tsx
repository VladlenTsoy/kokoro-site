"use client"

import React from "react"
import {useSelector} from "react-redux"
import CartProductItem from "@/components/cart-product-item/CartProductItem"
import CartTotalBlock from "@/components/cart-total-block/CartTotalBlock"
import {selectCartItems} from "@/features/cart/cartSlice"
import {useCartAvailability} from "@/features/cart/useCartAvailability"
import styles from "@/app/cart/page.module.css"
import Image from "next/image"
import Button from "@/components/button/Button"
import {useRouter} from "next/navigation"

const CartContent = () => {
    const router = useRouter()
    const items = useSelector(selectCartItems)
    const {issueByItemId, hasUnavailableItems, isCheckingAvailability} = useCartAvailability(items)

    if (items.length === 0) {
        return (
            <div className={styles.empty_cart}>
                <div className={styles.empty_visual}>
                    <Image src="/images/cart.svg" alt="Пустая корзина" width={58} height={58} />
                </div>
                <h2 className={styles.empty_title}>Корзина пока пустая</h2>
                <p className={styles.empty_text}>
                    Добавьте товары в корзину, чтобы перейти к оформлению заказа.
                </p>
                <div className={styles.empty_actions}>
                    <Button onClick={() => router.push("/collections")}>Перейти к покупкам</Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={styles.product_list}>
                {items.map(item => (
                    <CartProductItem key={item.id} item={item} availabilityMessage={issueByItemId.get(item.id)} />
                ))}
            </div>
            <div className={styles.sticky_sidebar}>
                <CartTotalBlock
                    checkoutDisabled={hasUnavailableItems || isCheckingAvailability}
                    checkoutDisabledMessage={hasUnavailableItems ? "Проверьте недоступные товары перед оформлением." : "Проверяем остатки..."}
                />
            </div>
        </>
    )
}

export default CartContent
