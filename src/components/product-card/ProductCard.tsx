import React from "react"
import styles from "./ProductCard.module.css"
import Image from "next/image"
import Link from "next/link"
import {formatPrice} from "@/utils/formatPrice"

interface ProductCardProps {
    id: number
    title: string
    price: number
    image: string
    discountedPrice?: number
}

const ProductCard: React.FC<ProductCardProps> = ({id, title, price, image, discountedPrice}) => {
    return (
        <Link href={`/product/${id}`} passHref>
            <div className={styles.product_card}>
                <Image className={styles.image} src={image} alt={title} height="263" width="351" />
                <div className={styles.title}>{title}</div>
                <div className={styles.price}>{formatPrice(price)} сум</div>
            </div>
        </Link>
    )
}

export default ProductCard
