import React from "react"
import styles from "./Footer.module.css"
import FooterImage from "@/layouts/footer/FooterImage"
import Link from "next/link"
import cn from "classnames"

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <ul className={styles.items}>
                        <li className={styles.title}>
                            Для клиентов
                        </li>
                        <li className={styles.item}>
                            <Link href="/" passHref>
                                Доставка
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/" passHref>
                                Возврат
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/" passHref>
                                Упаковка
                            </Link>
                        </li>
                    </ul>
                    <ul className={styles.items}>
                        <li className={styles.title}>
                            Информация
                        </li>
                        <li className={styles.item}>
                            <Link href="/" passHref>
                                Публичная оферта
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/" passHref>
                                Пользовательское соглашение
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/" passHref>
                                Политика конфиденциальности
                            </Link>
                        </li>
                    </ul>
                    <ul className={styles.items}>

                    </ul>
                    <ul className={styles.items}>
                        <li className={styles.title}>Контакты</li>
                        <li className={cn(styles.item, styles.desc)}>Tel: <a href="tel:+998338403006">+998-70-019-29-33</a></li>
                        <li className={cn(styles.item, styles.desc)}>Email: <a href="mailto:info@kokoro.uz">info@kokoro.uz</a></li>
                        <li className={cn(styles.item, styles.desc)}><a href="https://www.instagram.com/kokoro.mode/" target="_blank">Instagram</a></li>
                        <li className={cn(styles.item, styles.desc)}><a href="https://t.me/kokoro_wear" target="_blank">Telegram</a></li>
                        <li className={cn(styles.item, styles.desc)}><a href="https://www.facebook.com/people/Kokoro/61557878135619/" target="_blank">Facebook</a></li>
                    </ul>
                </div>
                <FooterImage />
            </div>
        </div>
    )
}

export default Footer
