"use client"

import React, {useEffect, useState} from "react"
import Link from "next/link"
import Button from "@/components/button/Button"
import Input from "@/components/input/Input"
import {getClientProfile, updateClientProfile} from "@/features/client/clientApi"
import {useAuthorizedClient} from "@/features/client/useAuthorizedClient"
import {formatPrice} from "@/utils/formatPrice"
import styles from "./ClientArea.module.css"

const ProfilePageContent = () => {
    const {accessToken, refreshToken, client, onRefresh, onClient} = useAuthorizedClient()
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (client) {
            setName(client.name)
        }
    }, [client])

    useEffect(() => {
        if (!accessToken) return

        const load = async () => {
            setIsLoading(true)
            try {
                const profile = await getClientProfile(accessToken, refreshToken, onRefresh)
                onClient(profile)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Не удалось загрузить профиль.")
            } finally {
                setIsLoading(false)
            }
        }

        void load()
    }, [accessToken, refreshToken, onClient, onRefresh])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!accessToken || isSaving) return

        setError("")
        setMessage("")
        setIsSaving(true)
        try {
            const profile = await updateClientProfile({name: name.trim()}, accessToken, refreshToken, onRefresh)
            onClient(profile)
            setMessage("Профиль обновлён.")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось сохранить профиль.")
        } finally {
            setIsSaving(false)
        }
    }

    if (!accessToken) {
        return (
            <div className={styles.empty}>
                Войдите по телефону, чтобы открыть профиль. <Link href="/login">Перейти ко входу</Link>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div>
                    <h1>Профиль</h1>
                    <p>Здесь хранятся данные клиента, бонусы и быстрые переходы к заказам и адресам.</p>
                </div>
                <nav className={styles.nav}>
                    <Link href="/orders">Заказы</Link>
                    <Link href="/profile/addresses">Адреса</Link>
                </nav>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {message && <div className={styles.message}>{message}</div>}

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h4>Данные</h4>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <Input
                            label="Имя"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ali"
                        />
                        <Button type="submit" disabled={isSaving || isLoading}>
                            {isSaving ? "Сохраняем..." : "Сохранить"}
                        </Button>
                    </form>
                </div>

                <div className={styles.card}>
                    <h4>Аккаунт</h4>
                    <div className={styles.line}>Телефон <span>{client?.phone ?? "—"}</span></div>
                    <div className={styles.line}>Бонусы <b>{formatPrice(client?.bonusBalance ?? 0)} сум</b></div>
                    <div className={styles.line}>Статус <span>{client?.isActive ? "Активен" : "Неактивен"}</span></div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePageContent
