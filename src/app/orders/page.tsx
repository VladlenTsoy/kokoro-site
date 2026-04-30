import React from "react"
import Container from "@/layouts/container/Container"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import OrdersPageContent from "@/features/client/OrdersPageContent"

const Page = () => {
    return (
        <Container>
            <Breadcrumb items={[
                {href: "/", label: "Главная"},
                {label: "Заказы", isCurrent: true}
            ]} />
            <OrdersPageContent />
        </Container>
    )
}

export default Page
