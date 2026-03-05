import React from "react"
import type {Metadata} from "next"
import LegalPage from "@/features/legal/LegalPage"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
    title: "Возврат | KOKORO",
    description: "Правила возврата товаров KOKORO в соответствии с законодательством Республики Узбекистан.",
    alternates: {
        canonical: `${SITE_URL}/returns`
    },
    openGraph: {
        title: "Возврат | KOKORO",
        description: "Правила возврата товаров KOKORO в соответствии с законодательством Республики Узбекистан.",
        url: `${SITE_URL}/returns`,
        type: "website"
    },
    twitter: {
        card: "summary",
        title: "Возврат | KOKORO",
        description: "Правила возврата товаров KOKORO в соответствии с законодательством Республики Узбекистан."
    }
}

const Page = () => {
    return (
        <LegalPage
            title="Возврат"
            updatedAt="05.03.2026"
            sections={[
                {
                    title: "Условия возврата",
                    paragraphs: [
                        "Возврат товара надлежащего качества возможен в соответствии с законодательством Республики Узбекистан.",
                        "Товар должен сохранить товарный вид, фабричные ярлыки и признаки отсутствия эксплуатации."
                    ]
                },
                {
                    title: "Срок обращения",
                    paragraphs: [
                        "Для оформления возврата свяжитесь с нами в течение 10 календарных дней с момента получения заказа.",
                        "Рассмотрение заявки и проверка товара занимают до 5 рабочих дней."
                    ]
                },
                {
                    title: "Возврат денежных средств",
                    paragraphs: [
                        "Возврат средств выполняется тем же способом оплаты, который использовался при покупке, если иное не согласовано сторонами.",
                        "Срок зачисления зависит от банка или платежного провайдера."
                    ]
                }
            ]}
        />
    )
}

export default Page
