import React from "react"
import styles from "./Breadcrumb.module.css"
import cn from "classnames"
import Link from "next/link"

export interface BreadcrumbItem {
    href?: string
    label: string
    isCurrent?: boolean
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({items}) => {
    if (!items.length) return null

    return (
        <div className={styles.breadcrumb}>
            <div className={styles.item}>
                <Link href="/">
                    Главная
                </Link>
            </div>
            {items.map(item => (
                <React.Fragment key={item.href ?? item.label}>
                    <div className={styles.splash}>/</div>
                    <div className={cn(styles.item, {[styles.current]: item.isCurrent})}>
                        {item.isCurrent || !item.href ? (
                            item.label
                        ) : (
                            <Link href={item.href}>{item.label}</Link>
                        )}
                    </div>
                </React.Fragment>
            ))}
        </div>
    )
}

export default Breadcrumb
