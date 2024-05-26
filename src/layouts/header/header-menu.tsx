import React from "react"
import styles from "./header-menu.module.css"
import Link from "next/link"

const HeaderMenu = () => {
    return (
        <>
            <div className={styles.menu}>
                <Link href="/">Главная</Link>
                <Link href="/about-us">О Нас</Link>
                <Link href="/#collection">Коллекция</Link>
            </div>
            <div className={styles.m_menu}>
                <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 15.5H29" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M11 20.5H29" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M11 25.5H29" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" />
                </svg>
            </div>
        </>
    )
}

export default HeaderMenu
