import React from "react"
import styles from "./header.module.css"
import Link from "next/link"
import HeaderMenu from "@/layouts/header/header-menu"
import HeaderSubMenu from "@/layouts/header/header-sub-menu"
import Logo from "@/components/logo/Logo"

const Header: React.FC = () => {
    return (
        <div className={styles.header}>
            <HeaderMenu />
            <div className={styles.logo_block}>
                <Link href="/">
                    <Logo height={24} width={125} />
                </Link>
            </div>
            <HeaderSubMenu />
        </div>
    )
}

export default Header
