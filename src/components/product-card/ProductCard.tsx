import React from "react"
import styles from "./ProductCard.module.css"
import Image from "next/image"
import Link from "next/link"
import {formatPrice} from "@/utils/formatPrice"
import getTextValue from "@/utils/getTextValue"
import ImageBlock from "@/components/image-block/ImageBlock"

interface ProductCardProps {
    id: number
    title: string
    price: number
    image: string
    discountedPrice?: number
}

const ProductCard: React.FC<ProductCardProps> = ({id, title, price, image, discountedPrice}) => {
    const safeTitle = getTextValue(title)

    return (
        <Link href={`/product/${id}`} passHref>
            <div className={styles.product_card}>
                <div className={styles.image_wrapper}>
                    <ImageBlock src={image} alt={safeTitle} priority={false} fill />
                </div>
                <div className={styles.title}>{safeTitle}</div>
                <div className={styles.price}>{formatPrice(price)} сум</div>
            </div>
        </Link>
    )
}

export default ProductCard
