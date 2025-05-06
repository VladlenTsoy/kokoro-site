"use client"

import React from "react"
import styles from "./CartProductItem.module.css"
import Tag from "@/components/tag/Tag"
import Counter from "@/components/counter/Counter"
import Image from "next/image"
import {formatPrice} from "@/utils/formatPrice"
import ButtonDelete from "@/components/button-delete/ButtonDelete"

const CartProductItem = () => {
    return (
        <div className={styles.product_item}>
            <div className={styles.product_info}>
                <div className={styles.button_delete}>
                    <ButtonDelete />
                </div>
                <div className={styles.image}>
                    <Image
                        src={"/images/1.jpg"}
                        alt={"test"}
                        fill
                        sizes="(max-width: 768px) 120px, (max-width: 1200px) 150px, 100px"
                    />
                </div>
                <div className={styles.details}>
                    <div className={styles.title}>Футболка Tanjiro</div>
                    <div className={styles.tags}>
                        <Tag>oversize</Tag>
                        <Tag>Бело-Синий</Tag>
                    </div>
                </div>
            </div>
            <Counter defaultValue={1} />
            <div className={styles.price_block}>
                <div className={styles.discount}>
                    <svg width="104" height="18" viewBox="0 0 104 18" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 17C19.1615 11.1536 64.9876 -0.210397 103 1.10505" stroke="#F04438"
                              strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {formatPrice(1500000)}сум
                </div>
                <div className={styles.price}>{formatPrice(1500000)}сум</div>
            </div>
        </div>
    )
}

export default CartProductItem
