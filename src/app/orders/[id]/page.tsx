import React from "react"
import Container from "@/layouts/container/Container"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import {API_BASE_URL} from "@/utils/apiConfig"
import styles from "./page.module.css"
import {formatPrice} from "@/utils/formatPrice"
import Image from "next/image"
import OrderSuccessModalGate from "./OrderSuccessModalGate"

interface OrderStatus {
    id: number
    title: string
    access: string
    fixed: boolean
    position: number
}

interface OrderClient {
    id?: number
    name: string
    phone: string
}

interface OrderAddress {
    id?: number
    address: string
    location: {
        lat: number
        lng: number
    }
}

interface OrderItem {
    id: number
    qty: number
    price?: number
    discount?: number
    promotion?: boolean
    finalPrice?: number
    lineTotal?: number
    productVariant?: {
        id: number
        title: string
        image?: string
    }
    size?: {
        id: number
        title: string
    } | null
}

interface ClientOrderDetails {
    id: number
    total: number
    createdAt: string
    status: OrderStatus
    client: OrderClient
    address: OrderAddress
    items: OrderItem[]
}

const formatDate = (date: string) => {
    try {
        return new Intl.DateTimeFormat("ru-RU", {
            dateStyle: "long",
            timeStyle: "short"
        }).format(new Date(date))
    } catch {
        return date
    }
}

const getOrder = async (id: string): Promise<ClientOrderDetails | null> => {
    const response = await fetch(`${API_BASE_URL}/client/orders/${id}`, {
        cache: "no-store"
    })

    if (!response.ok) {
        return null
    }

    return response.json()
}

const formatMoney = (value?: number) => {
    if (typeof value !== "number") return "—"
    return `${formatPrice(value)} сум`
}

const getMapPreviewUrl = (lat: number, lng: number) =>
    `https://static-maps.yandex.ru/1.x/?lang=ru_RU&ll=${lng},${lat}&z=14&size=450,220&l=map&pt=${lng},${lat},pm2rdm`

const Page = async ({params}: {params: {id: string}}) => {
    const order = await getOrder(params.id)

    return (
        <Container>
            <Breadcrumb items={[
                {href: "/cart", label: "Корзина"},
                {href: "/cart/checkout", label: "Оформление заказа"},
                {label: `Заказ #${params.id}`, isCurrent: true}
            ]} />

            {!order ? (
                <div className={styles.not_found}>
                    <h3>Заказ не найден</h3>
                    <p>Проверьте номер заказа и попробуйте снова.</p>
                </div>
            ) : (
                <div className={styles.page}>
                    <div className={styles.header_card}>
                        <div>
                            <div className={styles.order_id}>Заказ #{order.id}</div>
                            <div className={styles.meta_row}>
                                Создан: <span>{formatDate(order.createdAt)}</span>
                            </div>
                            <div className={styles.meta_row}>
                                Итог: <span>{formatPrice(order.total)} сум</span>
                            </div>
                        </div>
                        <div className={styles.status_badge}>{order.status.title}</div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.info_card}>
                            <h5>Клиент</h5>
                            <div className={styles.info_line}>Имя: <span>{order.client.name}</span></div>
                            <div className={styles.info_line}>Телефон: <span>{order.client.phone}</span></div>
                        </div>

                        <div className={styles.info_card}>
                            <h5>Доставка</h5>
                            <div className={styles.info_line}>Адрес: <span>{order.address.address}</span></div>
                            <div className={styles.map_wrap}>
                                <Image
                                    src={getMapPreviewUrl(order.address.location.lat, order.address.location.lng)}
                                    alt={`Карта доставки: ${order.address.address}`}
                                    className={styles.map_image}
                                    width={450}
                                    height={220}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.items_card}>
                        <h5>Позиции заказа</h5>
                        <div className={styles.items_list}>
                            {order.items.map(item => {
                                const fallbackFinalPrice = typeof item.finalPrice === "number"
                                    ? item.finalPrice
                                    : item.price
                                const fallbackLineTotal = typeof item.lineTotal === "number"
                                    ? item.lineTotal
                                    : (typeof fallbackFinalPrice === "number" ? fallbackFinalPrice * item.qty : undefined)

                                return (
                                    <div className={styles.item_card} key={item.id}>
                                        <div className={styles.item_visual}>
                                            {item.productVariant?.image ? (
                                                <Image
                                                    src={item.productVariant.image}
                                                    alt={item.productVariant.title}
                                                    width={92}
                                                    height={112}
                                                    className={styles.item_image}
                                                />
                                            ) : (
                                                <div className={styles.item_image_placeholder}>Без фото</div>
                                            )}
                                        </div>

                                        <div className={styles.item_content}>
                                            <div className={styles.item_title}>
                                                {item.productVariant?.title || `Вариант #${item.productVariant?.id || "-"}`}
                                            </div>
                                            <div className={styles.item_subtitle}>
                                                Количество: {item.qty}
                                                {item.size ? ` • Размер: ${item.size.title}` : ""}
                                            </div>

                                            <div className={styles.item_prices}>
                                                <div className={styles.price_row}>
                                                    <span>Цена:</span>
                                                    <b>{formatMoney(item.price)}</b>
                                                </div>
                                                <div className={styles.price_row}>
                                                    <span>Скидка:</span>
                                                    <b>{formatMoney(item.discount ?? 0)}</b>
                                                </div>
                                                <div className={styles.price_row}>
                                                    <span>Цена за единицу:</span>
                                                    <b>{formatMoney(fallbackFinalPrice)}</b>
                                                </div>
                                                <div className={styles.price_row}>
                                                    <span>Сумма:</span>
                                                    <b>{formatMoney(fallbackLineTotal)}</b>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <OrderSuccessModalGate orderId={order.id} />
                </div>
            )}
        </Container>
    )
}

export default Page
