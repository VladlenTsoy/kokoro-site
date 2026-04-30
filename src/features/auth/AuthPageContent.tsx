"use client"

import React, {useEffect, useMemo, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useRouter, useSearchParams} from "next/navigation"
import Button from "@/components/button/Button"
import Input from "@/components/input/Input"
import {
    getCurrentClient,
    logoutClient,
    refreshAuthTokens,
    sendPhoneCode,
    verifyPhoneCode
} from "@/features/auth/authApi"
import {
    clearAuth,
    selectAccessToken,
    selectClient,
    selectRefreshToken,
    setAuth,
    setClient
} from "@/features/auth/authSlice"
import {
    formatUzbekistanPhone,
    getUzbekistanLocalDigits,
    isUzbekistanPhoneValid,
    toUzbekistanE164
} from "@/utils/phoneFormat"
import styles from "./AuthPageContent.module.css"

const getAuthErrorMessage = (error: unknown) => {
    if (!(error instanceof Error)) {
        return "Не удалось выполнить запрос. Попробуйте ещё раз."
    }

    const message = error.message.toLowerCase()

    if (message.includes("429")) {
        return "Слишком много попыток. Попробуйте немного позже."
    }
    if (message.includes("502")) {
        return "Сервис отправки кода временно недоступен."
    }
    if (message.includes("401")) {
        return "Неверный код. Проверьте цифры и попробуйте ещё раз."
    }
    if (message.includes("400")) {
        return "Код истёк или данные запроса некорректны. Отправьте код заново."
    }

    return error.message || "Не удалось выполнить запрос. Попробуйте ещё раз."
}

const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const restSeconds = seconds % 60
    return `${minutes}:${restSeconds.toString().padStart(2, "0")}`
}

const AuthPageContent = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const client = useSelector(selectClient)
    const accessToken = useSelector(selectAccessToken)
    const refreshToken = useSelector(selectRefreshToken)

    const [phoneLocal, setPhoneLocal] = useState("")
    const [isPhoneFocused, setIsPhoneFocused] = useState(false)
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [requestId, setRequestId] = useState("")
    const [expiresInSeconds, setExpiresInSeconds] = useState(0)
    const [requestError, setRequestError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isRefreshingProfile, setIsRefreshingProfile] = useState(false)

    const redirectTo = searchParams.get("redirectTo")
    const normalizedRedirectTo = redirectTo?.startsWith("/") ? redirectTo : null
    const phoneNumber = useMemo(() => toUzbekistanE164(phoneLocal), [phoneLocal])
    const phoneValue = isPhoneFocused || phoneLocal.length > 0
        ? formatUzbekistanPhone(phoneLocal)
        : ""
    const canVerify = requestId && code.replace(/\D/g, "").length >= 4

    useEffect(() => {
        if (!expiresInSeconds) return

        const timer = setInterval(() => {
            setExpiresInSeconds(prev => Math.max(prev - 1, 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [expiresInSeconds])

    useEffect(() => {
        if (!accessToken || !refreshToken || client || isRefreshingProfile) return

        const syncClient = async () => {
            setIsRefreshingProfile(true)
            try {
                const currentClient = await getCurrentClient(accessToken)
                dispatch(setClient(currentClient))
            } catch {
                try {
                    const refreshed = await refreshAuthTokens({refreshToken})
                    dispatch(setAuth(refreshed))
                } catch {
                    dispatch(clearAuth())
                }
            } finally {
                setIsRefreshingProfile(false)
            }
        }

        void syncClient()
    }, [accessToken, client, dispatch, isRefreshingProfile, refreshToken])

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextLocal = getUzbekistanLocalDigits(e.target.value)
        setPhoneLocal(nextLocal)
        setRequestError("")
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.replace(/\D/g, "").slice(0, 8))
        setRequestError("")
    }

    const handleSendCode = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        if (isSending) return

        setRequestError("")
        setSuccessMessage("")

        if (!isUzbekistanPhoneValid(phoneLocal)) {
            setRequestError("Введите корректный номер Узбекистана: +998 (XX) XXX-XX-XX.")
            return
        }

        setIsSending(true)
        try {
            const response = await sendPhoneCode({phoneNumber})
            setRequestId(response.requestId)
            setExpiresInSeconds(response.expiresInSeconds)
            setSuccessMessage(`Код отправлен на ${formatUzbekistanPhone(getUzbekistanLocalDigits(response.phoneNumber))}.`)
        } catch (error) {
            setRequestError(getAuthErrorMessage(error))
        } finally {
            setIsSending(false)
        }
    }

    const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isVerifying || !requestId) return

        setRequestError("")
        setSuccessMessage("")

        const normalizedCode = code.replace(/\D/g, "")
        if (normalizedCode.length < 4) {
            setRequestError("Введите код из сообщения.")
            return
        }

        setIsVerifying(true)
        try {
            const response = await verifyPhoneCode({
                phoneNumber,
                requestId,
                code: normalizedCode,
                ...(name.trim() ? {name: name.trim()} : {})
            })
            dispatch(setAuth(response))
            setSuccessMessage("Готово, вы вошли в аккаунт.")
            if (normalizedRedirectTo) {
                router.push(normalizedRedirectTo)
            }
        } catch (error) {
            setRequestError(getAuthErrorMessage(error))
        } finally {
            setIsVerifying(false)
        }
    }

    const handleLogout = async () => {
        if (isLoggingOut) return

        setIsLoggingOut(true)
        setRequestError("")
        try {
            if (refreshToken) {
                await logoutClient(refreshToken)
            }
        } catch {
            // Local logout still matters even if the token was already invalidated.
        } finally {
            dispatch(clearAuth())
            setIsLoggingOut(false)
            setSuccessMessage("Вы вышли из аккаунта.")
        }
    }

    if (client) {
        return (
            <section className={styles.auth_shell}>
                <div className={styles.auth_panel}>
                    <div className={styles.kicker}>Аккаунт</div>
                    <h1 className={styles.title}>Вы уже вошли</h1>
                    <div className={styles.profile_box}>
                        <div>
                            <span>Имя</span>
                            <strong>{client.name}</strong>
                        </div>
                        <div>
                            <span>Телефон</span>
                            <strong>{client.phone ?? "Не указан"}</strong>
                        </div>
                    </div>
                    {successMessage && <div className={styles.success_message}>{successMessage}</div>}
                    <div className={styles.actions}>
                        <Button block onClick={() => router.push(normalizedRedirectTo ?? "/cart/checkout")}>
                            Продолжить
                        </Button>
                        <button
                            className={styles.secondary_button}
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? "Выходим..." : "Выйти"}
                        </button>
                    </div>
                </div>
                <div className={styles.visual_panel}>
                    <div className={styles.brand_mark}>KOKORO</div>
                    <p>Быстрый вход по номеру телефона, чтобы заказы сохранялись за вами.</p>
                </div>
            </section>
        )
    }

    return (
        <section className={styles.auth_shell}>
            <div className={styles.auth_panel}>
                <div className={styles.kicker}>Вход для клиентов</div>
                <h1 className={styles.title}>Авторизация</h1>
                <p className={styles.description}>
                    Введите номер телефона, получите код и продолжайте оформление заказа уже как клиент.
                </p>

                {!requestId ? (
                    <form className={styles.form} onSubmit={handleSendCode}>
                        <Input
                            label="Номер телефона"
                            value={phoneValue}
                            onChange={handlePhoneChange}
                            onFocus={() => setIsPhoneFocused(true)}
                            onBlur={() => setIsPhoneFocused(false)}
                            inputMode="tel"
                            placeholder="+998 (__) ___-__-__"
                        />
                        {requestError && <div className={styles.error_message}>{requestError}</div>}
                        {successMessage && <div className={styles.success_message}>{successMessage}</div>}
                        <Button block type="submit" disabled={isSending}>
                            {isSending ? "Отправляем..." : "Отправить код"}
                        </Button>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={handleVerifyCode}>
                        <Input
                            label="Код из сообщения"
                            value={code}
                            onChange={handleCodeChange}
                            inputMode="numeric"
                            placeholder="1234"
                        />
                        <Input
                            label="Имя"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ali"
                        />
                        <div className={styles.meta_row}>
                            <span>{expiresInSeconds > 0 ? `Код действует ${formatTimer(expiresInSeconds)}` : "Код мог истечь"}</span>
                            <button
                                type="button"
                                className={styles.text_button}
                                onClick={() => void handleSendCode()}
                                disabled={isSending || expiresInSeconds > 540}
                            >
                                Отправить заново
                            </button>
                        </div>
                        {requestError && <div className={styles.error_message}>{requestError}</div>}
                        {successMessage && <div className={styles.success_message}>{successMessage}</div>}
                        <Button block type="submit" disabled={isVerifying || !canVerify}>
                            {isVerifying ? "Проверяем..." : "Войти"}
                        </Button>
                        <button
                            className={styles.secondary_button}
                            type="button"
                            onClick={() => {
                                setRequestId("")
                                setCode("")
                                setRequestError("")
                                setSuccessMessage("")
                            }}
                        >
                            Изменить номер
                        </button>
                    </form>
                )}
            </div>
            <div className={styles.visual_panel}>
                <div className={styles.brand_mark}>KOKORO</div>
                <p>Ваши данные остаются с заказом, а следующий checkout становится короче.</p>
            </div>
        </section>
    )
}

export default AuthPageContent
