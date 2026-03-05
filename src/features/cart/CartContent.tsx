"use client"

import React from "react"
import {useSelector} from "react-redux"
import CartProductItem from "@/components/cart-product-item/CartProductItem"
import CartTotalBlock from "@/components/cart-total-block/CartTotalBlock"
import {selectCartItems} from "@/features/cart/cartSlice"
import styles from "@/app/cart/page.module.css"

const CartContent = () => {
    const items = useSelector(selectCartItems)

    return (
        <>
            <div className={styles.product_list}>
                {items.map(item => (
                    <CartProductItem key={item.id} item={item} />
                ))}
            </div>
            <div className={styles.sticky_sidebar}>
                <CartTotalBlock />
            </div>
        </>
    )
}

export default CartContent
