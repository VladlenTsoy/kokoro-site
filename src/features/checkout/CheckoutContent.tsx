"use client"

import React, {useEffect, useState} from "react"
import styles from "./CheckoutContent.module.css"
import Input from "@/components/input/Input"
import CartTotalBlock from "@/components/cart-total-block/CartTotalBlock"
import CheckoutMapAddress from "@/components/checkout-map-address/CheckoutMapAddress"
import {API_BASE_URL} from "@/utils/apiConfig"
import {useDispatch, useSelector} from "react-redux"
import {clearCart, selectCartItems} from "@/features/cart/cartSlice"
import {useRouter} from "next/navigation"
import {selectAccessToken, selectClient} from "@/features/auth/authSlice"
import {
    formatUzbekistanPhone,
    getUzbekistanLocalDigits,
    isUzbekistanPhoneValid,
    toUzbekistanE164
} from "@/utils/phoneFormat"
import {saveGuestOrderAccess} from "@/features/orders/guestOrdersSlice"

const CheckoutContent = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const cartItems = useSelector(selectCartItems)
    const accessToken = useSelector(selectAccessToken)
    const client = useSelector(selectClient)
    const [name, setName] = useState("")
    const [phoneLocal, setPhoneLocal] = useState("")
    const [addressTitle, setAddressTitle] = useState("")
    const [addressDescription, setAddressDescription] = useState("")
    const [addressLocation, setAddressLocation] = useState<{lat: number; lng: number} | null>(null)
    const [isPhoneFocused, setIsPhoneFocused] = useState(false)
    const [nameError, setNameError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [addressError, setAddressError] = useState("")
    const [promoCode, setPromoCode] = useState("")
    const [bonusToSpend, setBonusToSpend] = useState("")
    const [comment, setComment] = useState("")
    const [requestError, setRequestError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [addressResetToken, setAddressResetToken] = useState(0)
    const [isRedirectingAfterCreate, setIsRedirectingAfterCreate] = useState(false)

    useEffect(() => {
        if (!client) return

        setName(client.name ?? "")
        if (client.phone) {
            setPhoneLocal(getUzbekistanLocalDigits(client.phone))
        }
    }, [client])

    useEffect(() => {
        if (isSubmitting || isRedirectingAfterCreate) return
        if (cartItems.length === 0) {
            router.replace("/cart")
        }
    }, [cartItems.length, isSubmitting, isRedirectingAfterCreate, router])

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        if (nameError) {
            setNameError("")
        }
    }

    const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextLocal = getUzbekistanLocalDigits(e.target.value)
        setPhoneLocal(nextLocal)
        if (phoneError && isUzbekistanPhoneValid(nextLocal)) {
            setPhoneError("")
        }
    }

    const validateName = () => {
        if (name.trim().length < 2) {
            setNameError("Введите имя (минимум 2 символа).")
            return false
        }
        setNameError("")
        return true
    }

    const validatePhone = () => {
        if (!isUzbekistanPhoneValid(phoneLocal)) {
            setPhoneError("Введите корректный номер Узбекистана: +998 (XX) XXX-XX-XX.")
            return false
        }
        setPhoneError("")
        return true
    }

    const validateAddress = () => {
        if (!addressTitle.trim() || !addressLocation) {
            setAddressError("Выберите адрес доставки")
            return false
        }
        setAddressError("")
        return true
    }

    const validateForm = () => {
        const nameValid = accessToken ? true : validateName()
        const phoneValid = accessToken ? true : validatePhone()
        const addressValid = validateAddress()
        return nameValid && phoneValid && addressValid
    }

    const submitCheckout = async () => {
        if (isSubmitting) return
        setRequestError("")

        if (cartItems.length === 0) {
            setRequestError("Корзина пуста. Добавьте товары перед оформлением заказа.")
            return
        }
        if (!validateForm()) return
        if (!addressLocation) return

        const payload = {
            ...(!accessToken ? {
                client: {
                    name: name.trim(),
                    phone: toUzbekistanE164(phoneLocal)
                }
            } : {}),
            address: {
                address: addressDescription
                    ? `${addressTitle}, ${addressDescription}`
                    : addressTitle,
                location: {
                    lat: addressLocation.lat,
                    lng: addressLocation.lng
                }
            },
            items: cartItems.map(item => ({
                productVariantId: item.productVariantId,
                ...(item.sizeId ? {sizeId: item.sizeId} : {}),
                qty: item.qty
            })),
            ...(promoCode.trim() ? {promoCode: promoCode.trim()} : {}),
            ...(bonusToSpend.trim() ? {bonusToSpend: Number(bonusToSpend.replace(/\D/g, ""))} : {}),
            ...(comment.trim() ? {comment: comment.trim()} : {})
        }

        setIsSubmitting(true)
        try {
            const response = await fetch(`${API_BASE_URL}/client/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {})
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                let responseError = `Не удалось оформить заказ. Код ошибки: ${response.status}`

                try {
                    const errorData = await response.json()
                    if (typeof errorData?.message === "string" && errorData.message.trim()) {
                        responseError = errorData.message
                    }
                } catch {
                    // ignore parse error and fallback to default message
                }

                setRequestError(responseError)
                return
            }

            const responseData = await response.json().catch(() => null)
            const normalizedOrderId = typeof responseData?.id === "number"
                ? responseData.id
                : (typeof responseData?.order?.id === "number" ? responseData.order.id : null)

            if (normalizedOrderId === null) {
                setRequestError("Заказ создан, но не удалось получить его номер. Попробуйте обновить страницу.")
                return
            }

            const orderAccessToken = typeof responseData?.accessToken === "string"
                ? responseData.accessToken
                : (typeof responseData?.order?.accessToken === "string" ? responseData.order.accessToken : null)

            if (!accessToken && orderAccessToken) {
                dispatch(saveGuestOrderAccess({
                    orderId: normalizedOrderId,
                    orderAccessToken
                }))
            }

            setIsRedirectingAfterCreate(true)
            dispatch(clearCart())
            setName("")
            setPhoneLocal("")
            setAddressTitle("")
            setAddressDescription("")
            setAddressLocation(null)
            setPromoCode("")
            setBonusToSpend("")
            setComment("")
            setAddressResetToken(prev => prev + 1)
            router.push(`/orders/${normalizedOrderId}?success=1`)
        } catch {
            setRequestError("Сервис временно недоступен. Попробуйте ещё раз.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        void submitCheckout()
    }

    const phoneValue = isPhoneFocused || phoneLocal.length > 0
        ? formatUzbekistanPhone(phoneLocal)
        : ""

    return (
        <div className={styles.container}>
            <form onSubmit={onSubmitHandler}>
                <h4 className={styles.form_title}>Основные данные</h4>
                {accessToken && client && (
                    <div className={styles.auth_notice}>
                        Заказ будет оформлен на аккаунт {client.name}
                    </div>
                )}
                <div className={styles.form_items}>
                    <div className={styles.form_item}>
                        <Input
                            label="Введите имя"
                            value={name}
                            onChange={onNameChange}
                            onBlur={() => {
                                validateName()
                            }}
                        />
                        {nameError && <div className={styles.error}>{nameError}</div>}
                    </div>
                    <div className={styles.form_item}>
                        <Input
                            label="Номер телефона"
                            value={phoneValue}
                            onChange={onPhoneChange}
                            onFocus={() => setIsPhoneFocused(true)}
                            onBlur={() => {
                                setIsPhoneFocused(false)
                                validatePhone()
                            }}
                            inputMode="tel"
                            placeholder="+998 (__) ___-__-__"
                        />
                        {phoneError && <div className={styles.error}>{phoneError}</div>}
                    </div>
                </div>

                <h4 className={styles.form_title}>Доставка</h4>
                <CheckoutMapAddress
                    key={addressResetToken}
                    showError={!!addressError}
                    onAddressChange={payload => {
                        setAddressTitle(payload.title)
                        setAddressDescription(payload.description)
                        setAddressLocation(payload.location)
                        if (addressError) {
                            setAddressError("")
                        }
                    }}
                />

                <h4 className={styles.form_title}>Оплата</h4>
                <div className={styles.form_items}>
                    <div className={styles.form_item}>
                        <Input
                            label="Промокод"
                            value={promoCode}
                            onChange={e => setPromoCode(e.target.value)}
                            placeholder="KOKORO"
                        />
                    </div>
                    <div className={styles.form_item}>
                        <Input
                            label="Бонусы к списанию"
                            value={bonusToSpend}
                            onChange={e => setBonusToSpend(e.target.value.replace(/\D/g, ""))}
                            inputMode="numeric"
                            placeholder="0"
                        />
                    </div>
                </div>
                <div className={styles.form_item}>
                    <label className={styles.textarea_label}>Комментарий</label>
                    <textarea
                        className={styles.textarea}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={4}
                        placeholder="Например, уточнение по доставке"
                    />
                </div>

                {requestError && <div className={styles.error_message}>{requestError}</div>}
            </form>

            <div className={styles.sticky_sidebar}>
                <CartTotalBlock
                    checkoutButtonText={isSubmitting ? "Оформляем..." : "Оформить заказ"}
                    onCheckoutClick={() => {
                        void submitCheckout()
                    }}
                    disableCheckoutIfEmpty={false}
                    promoCode={promoCode}
                    bonusToSpend={Number(bonusToSpend || 0)}
                    showPromoInput={false}
                />
            </div>
        </div>
    )
}

export default CheckoutContent
