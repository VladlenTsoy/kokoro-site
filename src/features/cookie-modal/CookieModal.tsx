"use client"

import React, {useEffect, useState} from "react"
import styles from "./CookieModal.module.css"
import Image from "next/image"
import Button from "@/components/button/Button"

const CookieModal = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent")
        if (!consent) {
            setIsVisible(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.cookie_modal}>
                <Image src="./images/cookie.svg" alt="cookie" width="94" height="75" />
                <div className={styles.title}>Мы используем Cookie</div>
                <div className={styles.text}>
                    Для улучшения вашего опыта на нашем сайте мы используем файлы cookie. Продолжая пользоваться сайтом,
                    вы
                    соглашаетесь с нашей политикой использования cookie.
                </div>
                <Button block onClick={handleAccept}>Продолжить</Button>
            </div>
        </div>
    )
}

export default CookieModal
