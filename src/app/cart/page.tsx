import React from "react"
import styles from "./page.module.css"
import Container from "@/layouts/container/Container"
import CartContent from "@/features/cart/CartContent"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"

const Page = () => {
    return (
        <Container>
            <Breadcrumb items={[{label: "Корзина", isCurrent: true}]} />
            <div className={styles.container}>
                <CartContent />
            </div>
        </Container>
    )
}

export default Page
