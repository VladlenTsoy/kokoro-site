"use client"

import React, {useEffect, useState} from "react"
import Link from "next/link"
import Button from "@/components/button/Button"
import {addItem} from "@/features/cart/cartSlice"
import {useDispatch} from "react-redux"
import {useRouter} from "next/navigation"
import {API_BASE_URL} from "@/utils/apiConfig"
import {getClientOrders, Order, reorderClientOrder} from "@/features/client/clientApi"
import {useAuthorizedClient} from "@/features/client/useAuthorizedClient"
import {formatPrice} from "@/utils/formatPrice"
import styles from "./ClientArea.module.css"

const formatDate = (date: string) => {
    try {
        return new Intl.DateTimeFormat("ru-RU", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(date))
    } catch {
        return date
    }
}

const OrdersPageContent = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const {accessToken, refreshToken, onRefresh} = useAuthorizedClient()
    const [orders, setOrders] = useState<Order[]>([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isReordering, setIsReordering] = useState<number | null>(null)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!accessToken) return

        const load = async () => {
            setIsLoading(true)
            setError("")
            try {
                const response = await getClientOrders(1, 20, accessToken, refreshToken, onRefresh)
                setOrders(response.items)
                setTotal(response.total)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Не удалось загрузить заказы.")
            } finally {
                setIsLoading(false)
            }
        }

        void load()
    }, [accessToken, refreshToken, onRefresh])

    const handleReorder = async (orderId: number) => {
        if (!accessToken) return
        setIsReordering(orderId)
        setError("")
        setMessage("")

        try {
            const response = await reorderClientOrder(orderId, accessToken, refreshToken, onRefresh)
            const variants = await Promise.all(response.items.map(async item => {
                const result = await fetch(`${API_BASE_URL}/product/variants/${item.productVariantId}`)
                if (!result.ok) return null
                return result.json()
            }))

            response.items.forEach((item, index) => {
                const variant = variants[index]
                if (!variant) return
                dispatch(addItem({
                    productVariantId: item.productVariantId,
                    sizeId: null,
                    qty: item.qty,
                    price: Number(variant.price ?? 0),
                    title: String(variant.title ?? `Товар #${item.productVariantId}`),
                    image: String(variant.images?.[0]?.path ?? "/images/1.jpg"),
                    colorTitle: variant.color?.title
                }))
            })

            setMessage("Товары добавлены в корзину.")
            router.push("/cart/checkout")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось повторить заказ.")
        } finally {
            setIsReordering(null)
        }
    }

    if (!accessToken) {
        return (
            <div className={styles.empty}>
                Войдите по телефону, чтобы видеть историю заказов. <Link href="/login">Перейти ко входу</Link>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div>
                    <h1>Заказы</h1>
                    <p>История заказов, статусы оплаты и быстрый повтор заказа для авторизованного клиента.</p>
                </div>
                <nav className={styles.nav}>
                    <Link href="/profile">Профиль</Link>
                    <Link href="/profile/addresses">Адреса</Link>
                </nav>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {message && <div className={styles.message}>{message}</div>}

            {isLoading ? (
                <div className={styles.empty}>Загружаем заказы...</div>
            ) : orders.length === 0 ? (
                <div className={styles.empty}>Заказов пока нет.</div>
            ) : (
                <div className={styles.list}>
                    {orders.map(order => (
                        <div className={styles.row_card} key={order.id}>
                            <div className={styles.row_header}>
                                <div>
                                    <strong>Заказ {order.orderNumber ? `#${order.orderNumber}` : `#${order.id}`}</strong>
                                    <div className={styles.line}>Создан <span>{formatDate(order.createdAt)}</span></div>
                                    <div className={styles.line}>Итог <b>{formatPrice(order.total)} сум</b></div>
                                </div>
                                <div className={styles.badge}>{order.deliveryStatus ?? order.status?.title ?? "pending"}</div>
                            </div>
                            <div className={styles.actions}>
                                <Button onClick={() => router.push(`/orders/${order.id}`)}>Открыть</Button>
                                <button
                                    type="button"
                                    className={styles.text_button}
                                    disabled={isReordering === order.id}
                                    onClick={() => void handleReorder(order.id)}
                                >
                                    {isReordering === order.id ? "Повторяем..." : "Повторить заказ"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {total > orders.length && (
                <div className={styles.empty}>Показаны первые {orders.length} из {total} заказов.</div>
            )}
        </div>
    )
}

export default OrdersPageContent
