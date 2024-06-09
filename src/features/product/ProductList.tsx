import React from "react"
import ProductCard from "@/components/product-card/ProductCard"
import styles from "./ProductList.module.css"

const ProductList = () => {
    return (
        <div className={styles.product_list}>
            <h2>Новая<br />коллекция</h2>
            <div className={styles.container}>
                {[1,2,3,4,5].map((id) =>
                    <ProductCard
                        key={id}
                        id={id}
                        title={"Ichigo Bleach"}
                        price={350000}
                        image={"/images/t-shirt.png"}
                    />
                )}
            </div>
        </div>
    )
}

export default ProductList
