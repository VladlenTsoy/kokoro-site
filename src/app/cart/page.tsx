import React from "react"
import styles from "./page.module.css"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import Container from "@/layouts/container/Container"
import CartContent from "@/features/cart/CartContent"

const Page = () => {
    return (
        <Container>
            <Breadcrumb />
            <div className={styles.container}>
                <CartContent />
            </div>
        </Container>
    )
}

export default Page
