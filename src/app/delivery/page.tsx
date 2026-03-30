import React from "react"
import type {Metadata} from "next"
import LegalPage from "@/features/legal/LegalPage"
import {SITE_URL} from "@/utils/siteConfig"

export const metadata: Metadata = {
    title: "Доставка | KOKORO",
    description: "Условия доставки заказов KOKORO по Ташкенту и регионам Республики Узбекистан.",
    alternates: {
        canonical: `${SITE_URL}/delivery`
    },
    openGraph: {
        title: "Доставка | KOKORO",
        description: "Условия доставки заказов KOKORO по Ташкенту и регионам Республики Узбекистан.",
        url: `${SITE_URL}/delivery`,
        type: "website"
    },
    twitter: {
        card: "summary",
        title: "Доставка | KOKORO",
        description: "Условия доставки заказов KOKORO по Ташкенту и регионам Республики Узбекистан."
    }
}

const Page = () => {
    return (
        <LegalPage
            title="Доставка"
            updatedAt="05.03.2026"
            sections={[
                {
                    title: "Зона доставки",
                    paragraphs: [
                        "Мы осуществляем доставку по всей территории Республики Узбекистан.",
                        "Доставка в другие страны обсуждается индивидуально через службу поддержки."
                    ]
                },
                {
                    title: "Сроки",
                    list: [
                        "Ташкент: 1-2 рабочих дня.",
                        "Областные центры: 2-5 рабочих дней.",
                        "Удаленные регионы: до 7 рабочих дней."
                    ]
                },
                {
                    title: "Оплата и получение",
                    paragraphs: [
                        "Перед отправкой вы получаете подтверждение заказа и данные для отслеживания.",
                        "При получении рекомендуем проверить целостность упаковки и соответствие товара заказу."
                    ]
                }
            ]}
        />
    )
}

export default Page
