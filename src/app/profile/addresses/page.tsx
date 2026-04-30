import React from "react"
import Container from "@/layouts/container/Container"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import AddressesPageContent from "@/features/client/AddressesPageContent"

const Page = () => {
    return (
        <Container>
            <Breadcrumb items={[
                {href: "/", label: "Главная"},
                {href: "/profile", label: "Профиль"},
                {label: "Адреса", isCurrent: true}
            ]} />
            <AddressesPageContent />
        </Container>
    )
}

export default Page
