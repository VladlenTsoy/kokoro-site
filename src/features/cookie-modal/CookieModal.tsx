import React from "react"
import styles from "./CookieModal.module.css"
import Image from "next/image"
import Button from "@/components/button/Button"

const CookieModal = () => {
    return (
        <div className={styles.cookie_modal}>
            <Image src="./images/cookie.svg" alt="cookie" width="94" height="75" />
            <div className={styles.title}>Мы используем Cookie</div>
            <div className={styles.text}>
                Для улучшения вашего опыта на нашем сайте мы используем файлы cookie. Продолжая пользоваться сайтом, вы
                соглашаетесь с нашей политикой использования cookie.
            </div>
            <Button>Продолжить</Button>
        </div>
    )
}

export default CookieModal
