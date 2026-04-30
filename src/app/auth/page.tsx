import React, {Suspense} from "react"
import Container from "@/layouts/container/Container"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import AuthPageContent from "@/features/auth/AuthPageContent"

const Page = () => {
    return (
        <Container>
            <Breadcrumb items={[
                {href: "/", label: "Главная"},
                {label: "Авторизация", isCurrent: true}
            ]} />
            <Suspense fallback={null}>
                <AuthPageContent />
            </Suspense>
        </Container>
    )
}

export default Page
