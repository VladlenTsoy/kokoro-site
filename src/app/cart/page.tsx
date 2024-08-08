import React from "react"
import styles from "./page.module.css"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import Container from "@/layouts/container/Container"
import CartProductItem from "@/components/cart-product-item/CartProductItem"
import CartTotalBlock from "@/components/cart-total-block/CartTotalBlock"

const Page = () => {
    return (
        <Container>
            <Breadcrumb />
            <div className={styles.container}>
                <div className={styles.product_list}>
                    <CartProductItem />
                    <CartProductItem />
                    <CartProductItem />
                </div>
                <div>
                    <CartTotalBlock />
                </div>
            </div>
        </Container>
    )
}

export default Page
