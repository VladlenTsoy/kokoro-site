import React from "react"
import styles from "./Breadcrumb.module.css"
import cn from "classnames"
import Link from "next/link"

const Breadcrumb = () => {
    return (
        <div className={styles.breadcrumb}>
            <div className={styles.item}>
                <Link href="/">
                    Главная
                </Link>
            </div>
            <div className={styles.spash}>/</div>
            <div className={cn(styles.item, styles.current)}>Футболка Tanjiro Demon Slayer</div>
        </div>
    )
}

export default Breadcrumb
