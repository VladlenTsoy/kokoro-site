"use client"

import React from "react"
import styles from "./CartProductItem.module.css"
import Tag from "@/components/tag/Tag"
import Counter from "@/components/counter/Counter"
import Image from "next/image"
import Link from "next/link"
import {formatPrice} from "@/utils/formatPrice"
import ButtonDelete from "@/components/button-delete/ButtonDelete"
import type {CartItem} from "@/features/cart/cartSlice"
import {removeItem, updateQty} from "@/features/cart/cartSlice"
import {useDispatch} from "react-redux"
import {calculateDiscountedTotal} from "@/utils/calculateDiscountedTotal"

interface CartProductItemProps {
    item: CartItem
}

const CartProductItem: React.FC<CartProductItemProps> = ({item}) => {
    const dispatch = useDispatch()
    const discountPercent = typeof item.discountPercent === "number" ? item.discountPercent : 0
    const hasDiscount = discountPercent > 0
    const totalPrice = item.price * item.qty
    const discountedTotalPrice = hasDiscount ? calculateDiscountedTotal(totalPrice, discountPercent) : totalPrice

    return (
        <div className={styles.product_item}>
            <div className={styles.product_info}>
                <div className={styles.button_delete}>
                    <ButtonDelete onClick={() => dispatch(removeItem(item.id))} />
                </div>
                <div className={styles.image}>
                    <Image
                        src={item.image || "/images/1.jpg"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 120px, (max-width: 1200px) 150px, 100px"
                    />
                </div>
                <div className={styles.details}>
                    <Link href={`/product/${item.productVariantId}`} className={styles.title_link}>
                        <div className={styles.title}>{item.title}</div>
                    </Link>
                    <div className={styles.tags}>
                        {item.sizeTitle && <Tag>{item.sizeTitle}</Tag>}
                        {item.colorTitle && <Tag>{item.colorTitle}</Tag>}
                    </div>
                </div>
            </div>
            <div className={styles.summary_block}>
                <Counter
                    defaultValue={item.qty}
                    min={1}
                    onChange={value => dispatch(updateQty({id: item.id, qty: value}))}
                />
                <div className={styles.price_block}>
                    {hasDiscount && (
                        <div className={styles.discount}>
                            <svg width="104" height="18" viewBox="0 0 104 18" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 17C19.1615 11.1536 64.9876 -0.210397 103 1.10505" stroke="#F04438"
                                      strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {formatPrice(totalPrice)}сум
                        </div>
                    )}
                    <div className={styles.price}>{formatPrice(discountedTotalPrice)}сум</div>
                </div>
            </div>
        </div>
    )
}

export default CartProductItem
