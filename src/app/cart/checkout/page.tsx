import React from "react"
import Container from "@/layouts/container/Container"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import CheckoutContent from "@/features/checkout/CheckoutContent"

const Page = () => {
    return (
        <Container>
            <Breadcrumb items={[
                {href: "/cart", label: "Корзина"},
                {label: "Оформление заказа", isCurrent: true}
            ]} />
            <CheckoutContent />
        </Container>
    )
}

export default Page
