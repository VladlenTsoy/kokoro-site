import React from "react"
import styles from "./page.module.css"
import Image from "next/image"

const Page = () => {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.soon}>Скоро</div>
                <div className={styles.stack}>
                    <Image src="/images/logo_white.svg" alt="KOKORO" width={180} height={42} priority />
                </div>
                <div className={styles.right}>
                    <a href="https://www.instagram.com/kokoro.mode">Instagram</a>
                    <a href="https://t.me/kokoro_wear">Telegram</a>
                </div>
            </div>
        </div>
    )
}

export default Page
