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
                            Навигация
                        </li>
                        <li className={styles.item}>
                            <Link href="/" passHref>
                                Главная
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/" passHref>
                                О нас
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/" passHref>
                                Коллекция
                            </Link>
                        </li>
                    </ul>
                    <ul className={styles.items}>
                        <li className={styles.title}>
                            Информация
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
                                Политика конфиденциальности персональных данных
                            </Link>
                        </li>
                    </ul>
                    <ul className={styles.items}></ul>
                    <ul className={styles.items}>
                        <li className={styles.title}>Контакты</li>
                        <li className={cn(styles.item, styles.desc)}>Tel: +998-33-999-99-99</li>
                        <li className={cn(styles.item, styles.desc)}>Email: info@kokoro.uz</li>
                        <li className={cn(styles.item, styles.desc)}>Instagram</li>
                        <li className={cn(styles.item, styles.desc)}>Telegram</li>
                        <li className={cn(styles.item, styles.desc)}>Facebook</li>
                    </ul>
                </div>
                <FooterImage />
            </div>
        </div>
    )
}

export default Footer
