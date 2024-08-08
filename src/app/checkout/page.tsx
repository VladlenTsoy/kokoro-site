import React from "react"
import styles from "./page.module.css"
import Container from "@/layouts/container/Container"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import Input from "@/components/input/Input"
import CartTotalBlock from "@/components/cart-total-block/CartTotalBlock"
import CheckoutMapAddress from "@/components/checkout-map-address/CheckoutMapAddress"

const Page = () => {
    return (
        <Container>
            <Breadcrumb />
            <div className={styles.container}>
                <div>
                    <h4 className={styles.form_title}>Основные данные</h4>
                    <div className={styles.form_items}>
                        <div className={styles.form_item}>
                            <Input label="Введите имя" />
                        </div>
                        <div className={styles.form_item}>
                            <Input label="Номер телефона" />
                        </div>
                    </div>
                    <h4 className={styles.form_title}>Доставка</h4>
                    <div className={styles.form_items}>
                    </div>
                    <CheckoutMapAddress />
                </div>
                <div>
                    <CartTotalBlock />
                </div>
            </div>
        </Container>
    )
}

export default Page
