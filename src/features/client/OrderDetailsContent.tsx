"use client"

import React, {useCallback, useEffect, useMemo, useState} from "react"
import Image from "next/image"
import {useSearchParams} from "next/navigation"
import {useSelector} from "react-redux"
import Button from "@/components/button/Button"
import {formatPrice} from "@/utils/formatPrice"
import {
    cancelOrder,
    getOrder,
    getPaymeLink,
    Order,
    OrderItem
} from "@/features/client/clientApi"
import {useAuthorizedClient} from "@/features/client/useAuthorizedClient"
import {selectGuestOrderAccessToken} from "@/features/orders/guestOrdersSlice"
import OrderSuccessModalGate from "@/app/orders/[id]/OrderSuccessModalGate"
import styles from "@/app/orders/[id]/page.module.css"

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

const formatMoney = (value?: number) => {
    if (typeof value !== "number") return "—"
    return `${formatPrice(value)} сум`
}

const getMapPreviewUrl = (lat: number, lng: number) =>
    `https://static-maps.yandex.ru/1.x/?lang=ru_RU&ll=${lng},${lat}&z=14&size=450,220&l=map&pt=${lng},${lat},pm2rdm`

const getItemTitle = (item: OrderItem) =>
    item.productVariant?.title || item.productTitle || `Вариант #${item.productVariant?.id || item.productVariantId || "-"}`

const isPaymePaymentMethod = (order: Order) => {
    const marker = `${order.paymentMethod?.code ?? ""} ${order.paymentMethod?.title ?? ""}`.toLowerCase()
    return marker.includes("payme") || marker.includes("pay me") || marker.includes("пэйм")
}

interface OrderDetailsContentProps {
    orderId: number
}

const OrderDetailsContent: React.FC<OrderDetailsContentProps> = ({orderId}) => {
    const params = useSearchParams()
    const {accessToken, refreshToken, onRefresh} = useAuthorizedClient()
    const storedGuestAccessToken = useSelector(selectGuestOrderAccessToken(orderId))
    const queryGuestAccessToken = params.get("accessToken")
    const orderAccessToken = queryGuestAccessToken || storedGuestAccessToken
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPaying, setIsPaying] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [cancelReason, setCancelReason] = useState("")
    const [error, setError] = useState("")

    const authOptions = useMemo(() => ({
        accessToken,
        refreshToken,
        orderAccessToken: accessToken ? null : orderAccessToken,
        onRefresh
    }), [accessToken, refreshToken, orderAccessToken, onRefresh])

    const loadOrder = useCallback(async () => {
        setIsLoading(true)
        setError("")
        try {
            const response = await getOrder(orderId, authOptions)
            setOrder(response)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось загрузить заказ.")
            setOrder(null)
        } finally {
            setIsLoading(false)
        }
    }, [authOptions, orderId])

    useEffect(() => {
        void loadOrder()
    }, [loadOrder])

    const handlePay = async () => {
        if (isPaying) return
        setIsPaying(true)
        setError("")
        try {
            const response = await getPaymeLink(orderId, {
                ...authOptions,
                lang: "ru"
            })
            window.location.href = response.paymentUrl
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось получить ссылку на оплату.")
        } finally {
            setIsPaying(false)
        }
    }

    const handleCancel = async () => {
        if (isCancelling) return
        setIsCancelling(true)
        setError("")
        try {
            const response = await cancelOrder(orderId, cancelReason, authOptions)
            setOrder(response)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось отменить заказ.")
        } finally {
            setIsCancelling(false)
        }
    }

    if (isLoading) {
        return <div className={styles.not_found}>Загружаем заказ...</div>
    }

    if (!order) {
        return (
            <div className={styles.not_found}>
                <h3>Заказ не найден</h3>
                <p>{error || "Проверьте номер заказа и попробуйте снова."}</p>
            </div>
        )
    }

    const canPay = order.paymentStatus === "pending" && isPaymePaymentMethod(order)
    const canCancel = order.deliveryStatus === "pending"
    const location = order.address?.location
    const lat = typeof location?.lat === "number" ? location.lat : null
    const lng = typeof location?.lng === "number" ? location.lng : null

    return (
        <div className={styles.page}>
            {error && <div className={styles.error_message}>{error}</div>}
            <div className={styles.header_card}>
                <div>
                    <div className={styles.order_id}>
                        Заказ {order.orderNumber ? `#${order.orderNumber}` : `#${order.id}`}
                    </div>
                    <div className={styles.meta_row}>Создан: <span>{formatDate(order.createdAt)}</span></div>
                    <div className={styles.meta_row}>Итог: <span>{formatPrice(order.total)} сум</span></div>
                    <div className={styles.meta_row}>Метод оплаты: <span>{order.paymentMethod?.title ?? "—"}</span></div>
                    <div className={styles.meta_row}>Оплата: <span>{order.paymentStatus ?? "pending"}</span></div>
                </div>
                <div className={styles.status_stack}>
                    <div className={styles.status_badge}>{order.deliveryStatus ?? order.status?.title ?? "pending"}</div>
                    <div className={styles.status_badge}>{order.paymentStatus ?? "pending"}</div>
                </div>
            </div>

            <div className={styles.order_actions}>
                {canPay && <Button onClick={() => void handlePay()} disabled={isPaying}>{isPaying ? "Готовим оплату..." : "Оплатить Payme"}</Button>}
                {canCancel && (
                    <div className={styles.cancel_box}>
                        <input
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            placeholder="Причина отмены"
                            className={styles.cancel_input}
                        />
                        <button
                            type="button"
                            className={styles.text_button}
                            disabled={isCancelling}
                            onClick={() => void handleCancel()}
                        >
                            {isCancelling ? "Отменяем..." : "Отменить заказ"}
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.grid}>
                <div className={styles.info_card}>
                    <h5>Клиент</h5>
                    <div className={styles.info_line}>Имя: <span>{order.client.name}</span></div>
                    <div className={styles.info_line}>Телефон: <span>{order.client.phone ?? "—"}</span></div>
                </div>

                <div className={styles.info_card}>
                    <h5>Доставка</h5>
                    <div className={styles.info_line}>Тип: <span>{order.deliveryType?.title ?? "—"}</span></div>
                    <div className={styles.info_line}>Адрес: <span>{order.address?.address ?? "—"}</span></div>
                    {lat !== null && lng !== null && (
                        <div className={styles.map_wrap}>
                            <Image
                                src={getMapPreviewUrl(lat, lng)}
                                alt={`Карта доставки: ${order.address?.address ?? "адрес"}`}
                                className={styles.map_image}
                                width={450}
                                height={220}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.items_card}>
                <h5>Позиции заказа</h5>
                <div className={styles.items_list}>
                    {order.items.map((item, index) => {
                        const fallbackFinalPrice = typeof item.finalPrice === "number" ? item.finalPrice : item.price
                        const fallbackLineTotal = typeof item.lineTotal === "number"
                            ? item.lineTotal
                            : (typeof fallbackFinalPrice === "number" ? fallbackFinalPrice * item.qty : undefined)
                        const image = item.productVariant?.image || item.image

                        return (
                            <div className={styles.item_card} key={item.id ?? `${item.productVariantId}-${index}`}>
                                <div className={styles.item_visual}>
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt={getItemTitle(item)}
                                            width={92}
                                            height={112}
                                            className={styles.item_image}
                                        />
                                    ) : (
                                        <div className={styles.item_image_placeholder}>Без фото</div>
                                    )}
                                </div>
                                <div className={styles.item_content}>
                                    <div className={styles.item_title}>{getItemTitle(item)}</div>
                                    <div className={styles.item_subtitle}>
                                        Количество: {item.qty}
                                        {item.size ? ` • Размер: ${item.size.title}` : ""}
                                        {item.sizeTitle ? ` • Размер: ${item.sizeTitle}` : ""}
                                    </div>
                                    <div className={styles.item_prices}>
                                        <div className={styles.price_row}><span>Цена:</span><b>{formatMoney(item.price)}</b></div>
                                        <div className={styles.price_row}><span>Скидка:</span><b>{formatMoney(item.discount ?? 0)}</b></div>
                                        <div className={styles.price_row}><span>Цена за единицу:</span><b>{formatMoney(fallbackFinalPrice)}</b></div>
                                        <div className={styles.price_row}><span>Сумма:</span><b>{formatMoney(fallbackLineTotal)}</b></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.info_card}>
                    <h5>Итого</h5>
                    <div className={styles.info_line}>Товары: <span>{formatMoney(order.subtotal)}</span></div>
                    <div className={styles.info_line}>Скидка: <span>{formatMoney(order.discountTotal ?? 0)}</span></div>
                    <div className={styles.info_line}>Промокод: <span>{order.promoCode ?? "—"}</span></div>
                    <div className={styles.info_line}>Скидка промокода: <span>{formatMoney(order.promoDiscount ?? 0)}</span></div>
                    <div className={styles.info_line}>Бонусы списаны: <span>{formatMoney(order.bonusSpent ?? 0)}</span></div>
                    <div className={styles.info_line}>Бонусы начислены: <span>{formatMoney(order.bonusEarned ?? 0)}</span></div>
                    <div className={styles.info_line}>Доставка: <span>{formatMoney(order.deliveryPrice ?? 0)}</span></div>
                    <div className={styles.info_line}>Итог: <span>{formatMoney(order.total)}</span></div>
                </div>

                <div className={styles.info_card}>
                    <h5>История</h5>
                    {order.histories?.length ? order.histories.map(history => (
                        <div className={styles.history_item} key={history.id}>
                            <b>{history.status?.title ?? history.deliveryStatus ?? history.paymentStatus ?? "Статус"}</b>
                            <span>{formatDate(history.createdAt)}</span>
                            {history.comment && <p>{history.comment}</p>}
                        </div>
                    )) : (
                        <div className={styles.info_line}>История пока пустая</div>
                    )}
                </div>
            </div>

            <OrderSuccessModalGate orderId={order.id} />
        </div>
    )
}

export default OrderDetailsContent
