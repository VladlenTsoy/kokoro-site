"use client"

import React, {useEffect, useRef, useState} from "react"
import styles from "./HeaderSubMenu.module.css"
import {useSelector} from "react-redux"
import {usePathname, useRouter} from "next/navigation"
import {selectCartCount, selectCartLastAddedAt} from "@/features/cart/cartSlice"
import Popover from "@/components/popover/Popover"
import CartIcon from "@/components/icons/CartIcon"
import CartPopoverContent from "@/features/cart/CartPopoverContent"
import Link from "next/link"
import {selectClient} from "@/features/auth/authSlice"

const AUTO_CLOSE_MS = 5_000

const HeaderSubMenu = () => {
    const pathname = usePathname()
    const router = useRouter()
    const isCartPage = pathname === "/cart"
    const count = useSelector(selectCartCount)
    const lastAddedAt = useSelector(selectCartLastAddedAt)
    const client = useSelector(selectClient)

    const [isOpen, setIsOpen] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const lastHandledAddRef = useRef<number | null>(null)
    const cartRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Prevent auto-open on initial hydration from persisted state.
        if (lastHandledAddRef.current === null) {
            lastHandledAddRef.current = lastAddedAt
            return
        }

        if (!lastAddedAt || lastHandledAddRef.current === lastAddedAt) return
        lastHandledAddRef.current = lastAddedAt

        if (isCartPage) {
            setIsOpen(false)
            return
        }

        setIsOpen(true)

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setIsOpen(false)
        }, AUTO_CLOSE_MS)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [lastAddedAt, isCartPage])

    useEffect(() => {
        setIsOpen(false)
        if (timerRef.current) clearTimeout(timerRef.current)
    }, [pathname])

    const handleClick = () => {
        setIsOpen(false)
        router.push("/cart")
    }

    const onCloseHandler = () => {
        setIsOpen(false)
    }

    return (
        <div className={styles.sub_menu}>
            <Link className={styles.account_link} href={client ? "/profile" : "/login"} aria-label="Аккаунт">
                <span className={styles.account_icon}>{client?.name?.trim()?.charAt(0) || "K"}</span>
                <span className={styles.account_text}>{client ? client.name : "Войти"}</span>
            </Link>
            <div
                ref={cartRef}
                className={styles.cart_wrapper}
            >
                <div className={styles.card_block}>
                    <div className={styles.cart_icon_block} onClick={handleClick}>
                        <CartIcon className={styles.cart_icon} />
                    </div>
                    {count > 0 && <span className={styles.cart_badge}>[{count}]</span>}
                </div>
                <Popover
                    open={isOpen && !isCartPage}
                    anchorRef={cartRef}
                    arrowOffset={count > 0 ? 28 : 0}
                    width={350}
                    offset={22}
                    usePortal
                    sticky
                >
                    <CartPopoverContent onClose={onCloseHandler} />
                </Popover>
            </div>
        </div>
    )
}

export default HeaderSubMenu
