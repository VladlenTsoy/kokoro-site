"use client"

import React from "react"
import styles from "./CartTotalBlock.module.css"
import Button from "@/components/button/Button"
import {formatPrice} from "@/utils/formatPrice"
import Input from "@/components/input/Input"
import {useSelector} from "react-redux"
import {selectCartItems, selectCartTotal} from "@/features/cart/cartSlice"

const CartTotalBlock = () => {
    const items = useSelector(selectCartItems)
    const total = useSelector(selectCartTotal)

    return (
        <div className={styles.container}>
            <h5 className={styles.title}>Ваша корзина:</h5>
            <div className={styles.product_list}>
                {items.map(item => (
                    <div className={styles.product_item} key={item.id}>
                        <div className={styles.label}>{item.title}</div>
                        <div className={styles.price}>
                            <span>{item.qty}</span>
                            <span>x</span>
                            {formatPrice(item.price)}cум
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.promo_code}>
                <Input placeholder="Введите промокод..." style={{paddingLeft: 0, paddingRight: 0}} />
            </div>
            <div className={styles.total}>
                <div className={styles.label}>Всего:</div>
                <div className={styles.value}>{formatPrice(total)}сум</div>
            </div>
            <Button block>
                К оформлению
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7.90674L28.0933 16.0001L20 24.0934" stroke="white" strokeWidth="2"
                          strokeMiterlimit="10" strokeLinecap="square" strokeLinejoin="round" />
                    <path d="M4.66406 16H27.1041" stroke="white" strokeWidth="2" strokeMiterlimit="10"
                          strokeLinecap="square" strokeLinejoin="round" />
                </svg>
            </Button>
        </div>
    )
}

export default CartTotalBlock
