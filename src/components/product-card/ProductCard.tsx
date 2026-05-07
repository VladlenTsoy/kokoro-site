import React from "react"
import styles from "./ProductCard.module.css"
import Link from "next/link"
import {formatPrice} from "@/utils/formatPrice"
import getTextValue from "@/utils/getTextValue"
import ImageBlock from "@/components/image-block/ImageBlock"
import {calculateDiscountedTotal} from "@/utils/calculateDiscountedTotal"
import cn from "classnames"

interface ProductCardProps {
    id: number
    title: string
    price: number
    image: string
    discount?: number
    availableQty?: number
}

const ProductCard: React.FC<ProductCardProps> = ({id, title, price, image, discount, availableQty}) => {
    const safeTitle = getTextValue(title)

    return (
        <Link href={`/product/${id}`} passHref>
            <div className={styles.product_card}>
                <div className={styles.image_wrapper}>
                    <ImageBlock src={image} alt={safeTitle} priority={false} fill />
                </div>
                {typeof availableQty === "number" && availableQty <= 0 && (
                    <div className={styles.stock_badge}>Нет в наличии</div>
                )}
                <div className={styles.title}>{safeTitle}</div>
                <div className={cn(styles.price, {[styles.discount]: !!discount})}>
                    {formatPrice(discount ? calculateDiscountedTotal(price, discount) : price)} сум
                </div>
                {
                    discount && <div className={styles.old_price_block}>
                        <svg width="104" height="18" viewBox="0 0 104 18" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 17C19.1615 11.1536 64.9876 -0.210397 103 1.10505" stroke="#F04438"
                                  strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <div className={styles.old_price}>{formatPrice(price)} сум</div>
                    </div>
                }
            </div>
        </Link>
    )
}

export default ProductCard
