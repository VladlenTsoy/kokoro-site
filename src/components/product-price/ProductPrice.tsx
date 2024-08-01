import React from "react"
import styles from "./ProductPrice.module.css"
import {formatPrice} from "@/utils/formatPrice"
import {calculateDiscountedTotal} from "@/utils/calculateDiscountedTotal"

interface ProductPriceProps {
    price: number
    discount?: number
}

const ProductPrice: React.FC<ProductPriceProps> = ({price, discount}) => {
    return (
        <div className={styles.prices}>
            {
                discount &&
                <div className={styles.discount}>
                    <svg width="104" height="18" viewBox="0 0 104 18" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 17C19.1615 11.1536 64.9876 -0.210397 103 1.10505" stroke="#F04438"
                              strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {formatPrice(price)}сум
                </div>
            }
            <div className={styles.price}>
                {formatPrice(discount ? calculateDiscountedTotal(price, discount) : price)}сум
            </div>
        </div>
    )
}

export default ProductPrice
