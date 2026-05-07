import React from "react"
import ProductCard from "@/components/product-card/ProductCard"
import styles from "./ProductList.module.css"
import type {ProductVariant} from "@/features/product-variants/productVariantsApi"

interface ProductListProps {
    title: React.ReactNode
    items?: ProductVariant[]
    limit?: number
}

const ProductList: React.FC<ProductListProps> = ({title, items = [], limit}) => {
    const visibleItems = limit ? items.slice(0, limit) : items
    const getAvailableQty = (item: ProductVariant) => (item.sizes || []).reduce(
        (sum, size) => sum + Math.max(Number(size.qty || 0) - Number(size.reservedQty || 0), 0),
        0
    )

    return (
        <div className={styles.product_list}>
            {title}
            <div className={styles.container}>
                {visibleItems.map(item =>
                    <ProductCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        price={item.price}
                        discount={item?.discount?.discountPercent ? Number(item?.discount?.discountPercent) : undefined}
                        image={item.images?.[0]?.path || "/images/t-shirt.png"}
                        availableQty={getAvailableQty(item)}
                    />
                )}
            </div>
        </div>
    )
}

export default ProductList
