import React from "react"
import styles from "./Footer.module.css"
import FooterImage from "@/layouts/footer/FooterImage"

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <ul className={styles.items}>
                        <li className={styles.item}>Главная</li>
                        <li className={styles.item}>О нас</li>
                        <li className={styles.item}>Коллекция</li>
                    </ul>
                    <ul className={styles.items}></ul>
                    <ul className={styles.items}></ul>
                    <ul className={styles.items}></ul>
                </div>
                <FooterImage />
            </div>
        </div>
    )
}

export default Footer
