import React from "react"
import type {Metadata} from "next"
import LegalPage from "@/features/legal/LegalPage"
import {SITE_URL} from "@/utils/siteConfig"

export const metadata: Metadata = {
    title: "Упаковка | KOKORO",
    description: "Информация об упаковке заказов KOKORO и контроле качества перед отправкой.",
    alternates: {
        canonical: `${SITE_URL}/packaging`
    },
    openGraph: {
        title: "Упаковка | KOKORO",
        description: "Информация об упаковке заказов KOKORO и контроле качества перед отправкой.",
        url: `${SITE_URL}/packaging`,
        type: "website"
    },
    twitter: {
        card: "summary",
        title: "Упаковка | KOKORO",
        description: "Информация об упаковке заказов KOKORO и контроле качества перед отправкой."
    }
}

const Page = () => {
    return (
        <LegalPage
            title="Упаковка"
            updatedAt="05.03.2026"
            sections={[
                {
                    title: "Стандарт упаковки",
                    paragraphs: [
                        "Каждый заказ упаковывается в фирменную упаковку KOKORO для защиты товара при транспортировке.",
                        "Мы используем материалы, которые обеспечивают сохранность изделия и презентабельный внешний вид."
                    ]
                },
                {
                    title: "Проверка перед отправкой",
                    list: [
                        "Проверка соответствия артикула и размера.",
                        "Проверка качества изделия и фурнитуры.",
                        "Контроль целостности упаковки перед передачей в доставку."
                    ]
                }
            ]}
        />
    )
}

export default Page
