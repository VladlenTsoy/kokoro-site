"use client"

import React, {useEffect} from "react"
import styles from "./OrderSuccessModal.module.css"
import Link from "next/link"

interface OrderSuccessModalProps {
    isOpen: boolean
    orderId: number | null
    onClose: () => void
    hideOrderLink?: boolean
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({isOpen, orderId, onClose, hideOrderLink = false}) => {
    useEffect(() => {
        if (!isOpen) return

        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        document.body.style.overflow = "hidden"
        window.addEventListener("keydown", onEsc)

        return () => {
            document.body.style.overflow = ""
            window.removeEventListener("keydown", onEsc)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
                    ×
                </button>

                <div className={styles.icon_wrap}>
                    <div className={styles.icon}>✓</div>
                </div>

                <h4 className={styles.title}>Заказ подтверждён, ваша покупка готова к отправке!</h4>
                <p className={styles.subtitle}>
                    Ваш заказ успешно оформлен и готовится к отправке. Ожидайте уведомление о доставке и следите за
                    статусом вашей покупки.
                </p>

                <div className={styles.actions}>
                    {!hideOrderLink && orderId !== null && (
                        <Link href={`/orders/${orderId}`} className={styles.primary_action}>
                            Посмотреть статус заказа
                        </Link>
                    )}
                    <Link href="/" className={styles.secondary_action}>На главную</Link>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccessModal
