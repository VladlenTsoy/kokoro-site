import React from "react"
import Container from "@/layouts/container/Container"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import ProfilePageContent from "@/features/client/ProfilePageContent"

const Page = () => {
    return (
        <Container>
            <Breadcrumb items={[
                {href: "/", label: "Главная"},
                {label: "Профиль", isCurrent: true}
            ]} />
            <ProfilePageContent />
        </Container>
    )
}

export default Page
