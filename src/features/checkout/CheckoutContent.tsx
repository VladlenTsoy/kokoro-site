"use client"

import React, {useState} from "react"
import styles from "./CheckoutContent.module.css"
import Input from "@/components/input/Input"
import CartTotalBlock from "@/components/cart-total-block/CartTotalBlock"
import CheckoutMapAddress from "@/components/checkout-map-address/CheckoutMapAddress"

const getUzbekistanLocalDigits = (value: string) => {
    const digits = value.replace(/\D/g, "")
    const hasExplicitPlusPrefix = value.trim().startsWith("+")

    if (hasExplicitPlusPrefix) {
        if (!digits.startsWith("998")) return ""
        return digits.slice(3, 12)
    }

    if (digits.startsWith("998")) return digits.slice(3, 12)
    if (digits.startsWith("0")) return digits.slice(1, 10)
    return digits.slice(0, 9)
}

const formatUzbekistanPhone = (local: string) => {
    let formatted = "+998"

    if (local.length > 0) {
        formatted += ` (${local.slice(0, 2)}`
    }
    if (local.length > 2) {
        formatted += ")"
    }
    if (local.length > 2) {
        formatted += ` ${local.slice(2, 5)}`
    }
    if (local.length > 5) {
        formatted += `-${local.slice(5, 7)}`
    }
    if (local.length > 7) {
        formatted += `-${local.slice(7, 9)}`
    }

    return formatted
}

const isUzbekistanPhoneValid = (local: string) => local.length === 9

const CheckoutContent = () => {
    const [name, setName] = useState("")
    const [phoneLocal, setPhoneLocal] = useState("")
    const [addressTitle, setAddressTitle] = useState("")
    const [isPhoneFocused, setIsPhoneFocused] = useState(false)
    const [nameError, setNameError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [addressError, setAddressError] = useState("")

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
        if (!addressTitle.trim()) {
            setAddressError("Выберите адрес доставки")
            return false
        }
        setAddressError("")
        return true
    }

    const validateForm = () => {
        const nameValid = validateName()
        const phoneValid = validatePhone()
        const addressValid = validateAddress()
        return nameValid && phoneValid && addressValid
    }

    const submitCheckout = () => {
        if (!validateForm()) return

        // TODO: replace with API request when backend endpoint is ready
        console.log("Checkout form submit (stub)", {
            name: name.trim(),
            phone: `+998${phoneLocal}`,
            address: addressTitle
        })
    }

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submitCheckout()
    }

    const phoneValue = isPhoneFocused || phoneLocal.length > 0
        ? formatUzbekistanPhone(phoneLocal)
        : ""

    return (
        <div className={styles.container}>
            <form onSubmit={onSubmitHandler}>
                <h4 className={styles.form_title}>Основные данные</h4>
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
                    showError={!!addressError}
                    onAddressChange={payload => {
                        setAddressTitle(payload.title)
                        if (addressError) {
                            setAddressError("")
                        }
                    }}
                />
            </form>

            <div className={styles.sticky_sidebar}>
                <CartTotalBlock checkoutButtonText="Оформить заказ" onCheckoutClick={submitCheckout} />
            </div>
        </div>
    )
}

export default CheckoutContent
