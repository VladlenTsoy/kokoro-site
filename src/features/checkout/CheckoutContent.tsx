"use client"

import React, {useEffect, useMemo, useState} from "react"
import styles from "./CheckoutContent.module.css"
import Input from "@/components/input/Input"
import CartTotalBlock from "@/components/cart-total-block/CartTotalBlock"
import CheckoutMapAddress from "@/components/checkout-map-address/CheckoutMapAddress"
import {API_BASE_URL} from "@/utils/apiConfig"
import {useDispatch, useSelector} from "react-redux"
import {clearCart, selectCartItems} from "@/features/cart/cartSlice"
import {useCartAvailability} from "@/features/cart/useCartAvailability"
import {useRouter} from "next/navigation"
import {selectAccessToken, selectClient} from "@/features/auth/authSlice"
import {
    formatUzbekistanPhone,
    getUzbekistanLocalDigits,
    isUzbekistanPhoneValid,
    toUzbekistanE164
} from "@/utils/phoneFormat"
import {saveGuestOrderAccess} from "@/features/orders/guestOrdersSlice"

interface PaymentMethodOption {
    id: number
    title: string
    code?: string | null
    isActive?: boolean
    isOnline?: boolean
}

interface DeliveryTypeOption {
    id: number
    title: string
    type?: string
    price?: number
    description?: string | null
}

interface SourceOption {
    id: number
    title: string
    code?: string | null
    isActive?: boolean
}

const isPaymePaymentMethod = (method: PaymentMethodOption | null) => {
    const marker = `${method?.code ?? ""} ${method?.title ?? ""}`.toLowerCase()
    return marker.includes("payme") || marker.includes("pay me") || marker.includes("пэйм")
}

const fetchCheckoutOptions = async <TOption,>(path: string): Promise<TOption[]> => {
    const response = await fetch(`${API_BASE_URL}${path}`)
    if (!response.ok) throw new Error(`Failed to load ${path}`)
    const data = await response.json()
    return Array.isArray(data) ? data : []
}

const CheckoutContent = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const cartItems = useSelector(selectCartItems)
    const {hasUnavailableItems, issues, isCheckingAvailability} = useCartAvailability(cartItems)
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
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([])
    const [deliveryTypes, setDeliveryTypes] = useState<DeliveryTypeOption[]>([])
    const [sourceId, setSourceId] = useState<number | null>(null)
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null)
    const [selectedDeliveryTypeId, setSelectedDeliveryTypeId] = useState<number | null>(null)

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


    useEffect(() => {
        let isMounted = true

        Promise.all([
            fetchCheckoutOptions<PaymentMethodOption>("/payment-method"),
            fetchCheckoutOptions<DeliveryTypeOption>("/delivery-types"),
            fetchCheckoutOptions<SourceOption>("/sources")
        ]).then(([paymentResponse, deliveryResponse, sourceResponse]) => {
            if (!isMounted) return

            const activePaymentMethods = paymentResponse.filter(method => method.isActive !== false)
            const activeSources = sourceResponse.filter(source => source.isActive !== false)
            const siteSource = activeSources.find(source => {
                const marker = `${source.code ?? ""} ${source.title ?? ""}`.toLowerCase()
                return marker.includes("site") || marker.includes("web") || marker.includes("сайт")
            })
            const defaultPayment = activePaymentMethods.find(isPaymePaymentMethod) ?? activePaymentMethods[0] ?? null
            const defaultDelivery = deliveryResponse.find(delivery => delivery.type === "courier") ?? deliveryResponse[0] ?? null

            setPaymentMethods(activePaymentMethods)
            setDeliveryTypes(deliveryResponse)
            setSourceId(siteSource?.id ?? activeSources[0]?.id ?? null)
            setSelectedPaymentMethodId(current => current ?? defaultPayment?.id ?? null)
            setSelectedDeliveryTypeId(current => current ?? defaultDelivery?.id ?? null)
        }).catch(() => {
            // Checkout options are optional for backward compatibility with older API deployments.
        })

        return () => {
            isMounted = false
        }
    }, [])

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
        if (isCheckingAvailability) {
            setRequestError("Проверяем доступность товаров. Попробуйте ещё раз через несколько секунд.")
            return
        }
        if (hasUnavailableItems) {
            setRequestError(issues[0]?.message || "В корзине есть недоступные товары. Вернитесь в корзину и обновите заказ.")
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
            ...(selectedPaymentMethodId ? {paymentMethodId: selectedPaymentMethodId} : {}),
            ...(selectedDeliveryTypeId ? {deliveryTypeId: selectedDeliveryTypeId} : {}),
            ...(sourceId ? {sourceId} : {}),
            ...(selectedDeliveryType ? {deliveryPrice: selectedDeliveryType.price ?? 0} : {}),
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

            if (isSelectedPaymentPayme) {
                try {
                    const paymeResponse = await fetch(`${API_BASE_URL}/client/orders/${normalizedOrderId}/payme-link${!accessToken && orderAccessToken ? `?accessToken=${encodeURIComponent(orderAccessToken)}&lang=ru` : "?lang=ru"}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {})
                        }
                    })
                    const paymeData = await paymeResponse.json().catch(() => null)
                    if (paymeResponse.ok && typeof paymeData?.paymentUrl === "string") {
                        window.location.href = paymeData.paymentUrl
                        return
                    }
                } catch {
                    // If Payme link creation fails, keep the order accessible so the user can retry payment.
                }
            }

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

    const selectedPaymentMethod = useMemo(
        () => paymentMethods.find(method => method.id === selectedPaymentMethodId) ?? null,
        [paymentMethods, selectedPaymentMethodId]
    )
    const selectedDeliveryType = useMemo(
        () => deliveryTypes.find(type => type.id === selectedDeliveryTypeId) ?? null,
        [deliveryTypes, selectedDeliveryTypeId]
    )
    const selectedDeliveryPrice = selectedDeliveryType?.price ?? 0
    const isSelectedPaymentPayme = isPaymePaymentMethod(selectedPaymentMethod)

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

                {deliveryTypes.length > 0 && (
                    <div className={styles.option_grid}>
                        {deliveryTypes.map(type => (
                            <button
                                type="button"
                                key={type.id}
                                className={`${styles.option_card} ${selectedDeliveryTypeId === type.id ? styles.option_card_active : ""}`}
                                onClick={() => setSelectedDeliveryTypeId(type.id)}
                            >
                                <span>{type.title}</span>
                                <b>{type.price && type.price > 0 ? `${type.price.toLocaleString("ru-RU")} сум` : "Бесплатно"}</b>
                                {type.description && <small>{type.description}</small>}
                            </button>
                        ))}
                    </div>
                )}

                <h4 className={styles.form_title}>Оплата</h4>
                {paymentMethods.length > 0 && (
                    <div className={styles.option_grid}>
                        {paymentMethods.map(method => (
                            <button
                                type="button"
                                key={method.id}
                                className={`${styles.option_card} ${selectedPaymentMethodId === method.id ? styles.option_card_active : ""}`}
                                onClick={() => setSelectedPaymentMethodId(method.id)}
                            >
                                <span>{method.title}</span>
                                <b>{isPaymePaymentMethod(method) ? "Онлайн через Payme" : (method.isOnline ? "Онлайн" : "При получении")}</b>
                            </button>
                        ))}
                    </div>
                )}
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

                {hasUnavailableItems && (
                    <div className={styles.error_message}>
                        В корзине есть товары или размеры, которые стали недоступны. Вернитесь в корзину и обновите заказ.
                    </div>
                )}
                {requestError && <div className={styles.error_message}>{requestError}</div>}
            </form>

            <div className={styles.sticky_sidebar}>
                <CartTotalBlock
                    checkoutButtonText={isSubmitting ? "Оформляем..." : (isSelectedPaymentPayme ? "Оформить и оплатить" : "Оформить заказ")}
                    onCheckoutClick={() => {
                        void submitCheckout()
                    }}
                    disableCheckoutIfEmpty={false}
                    checkoutDisabled={hasUnavailableItems || isCheckingAvailability}
                    checkoutDisabledMessage={hasUnavailableItems ? "В корзине есть недоступные товары." : "Проверяем остатки..."}
                    promoCode={promoCode}
                    bonusToSpend={Number(bonusToSpend || 0)}
                    deliveryPrice={selectedDeliveryPrice}
                    showPromoInput={false}
                />
            </div>
        </div>
    )
}

export default CheckoutContent
