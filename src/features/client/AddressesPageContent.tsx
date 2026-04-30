"use client"

import React, {useCallback, useEffect, useState} from "react"
import Link from "next/link"
import Button from "@/components/button/Button"
import Input from "@/components/input/Input"
import {
    ClientAddress,
    createClientAddress,
    deleteClientAddress,
    getClientAddresses,
    updateClientAddress
} from "@/features/client/clientApi"
import {useAuthorizedClient} from "@/features/client/useAuthorizedClient"
import styles from "./ClientArea.module.css"

const AddressesPageContent = () => {
    const {accessToken, refreshToken, onRefresh} = useAuthorizedClient()
    const [items, setItems] = useState<ClientAddress[]>([])
    const [address, setAddress] = useState("")
    const [editingId, setEditingId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const load = useCallback(async () => {
        if (!accessToken) return
        setIsLoading(true)
        setError("")
        try {
            const response = await getClientAddresses(accessToken, refreshToken, onRefresh)
            setItems(response)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось загрузить адреса.")
        } finally {
            setIsLoading(false)
        }
    }, [accessToken, refreshToken, onRefresh])

    useEffect(() => {
        void load()
    }, [load])

    const resetForm = () => {
        setAddress("")
        setEditingId(null)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!accessToken || isSaving) return
        if (!address.trim()) {
            setError("Введите адрес.")
            return
        }

        setIsSaving(true)
        setError("")
        setMessage("")
        try {
            if (editingId) {
                await updateClientAddress(editingId, {address: address.trim()}, accessToken, refreshToken, onRefresh)
                setMessage("Адрес обновлён.")
            } else {
                await createClientAddress({address: address.trim()}, accessToken, refreshToken, onRefresh)
                setMessage("Адрес добавлен.")
            }
            resetForm()
            await load()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось сохранить адрес.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!accessToken) return
        setError("")
        setMessage("")
        try {
            await deleteClientAddress(id, accessToken, refreshToken, onRefresh)
            setMessage("Адрес удалён.")
            await load()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось удалить адрес.")
        }
    }

    if (!accessToken) {
        return (
            <div className={styles.empty}>
                Войдите по телефону, чтобы управлять адресами. <Link href="/login">Перейти ко входу</Link>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <div>
                    <h1>Адреса</h1>
                    <p>Сохранённые адреса можно использовать при последующих заказах.</p>
                </div>
                <nav className={styles.nav}>
                    <Link href="/profile">Профиль</Link>
                    <Link href="/orders">Заказы</Link>
                </nav>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {message && <div className={styles.message}>{message}</div>}

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h4>{editingId ? "Редактировать адрес" : "Новый адрес"}</h4>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <Input
                            label="Адрес"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Город, улица, дом"
                        />
                        <div className={styles.actions}>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Сохраняем..." : "Сохранить"}
                            </Button>
                            {editingId && (
                                <button type="button" className={styles.text_button} onClick={resetForm}>
                                    Отмена
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className={styles.card}>
                    <h4>Список</h4>
                    {isLoading ? (
                        <div className={styles.empty}>Загружаем адреса...</div>
                    ) : items.length === 0 ? (
                        <div className={styles.empty}>Адресов пока нет.</div>
                    ) : (
                        <div className={styles.list}>
                            {items.map(item => (
                                <div className={styles.row_card} key={item.id}>
                                    <div className={styles.row_header}>
                                        <strong>{item.address}</strong>
                                        <span className={styles.badge}>#{item.id}</span>
                                    </div>
                                    <div className={styles.actions}>
                                        <button
                                            type="button"
                                            className={styles.text_button}
                                            onClick={() => {
                                                setEditingId(item.id)
                                                setAddress(item.address)
                                            }}
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.text_button}
                                            onClick={() => void handleDelete(item.id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddressesPageContent
