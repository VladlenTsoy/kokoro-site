import React from "react"
import styles from "./header.module.css"
import Image from "next/image"
import Link from "next/link"
import HeaderMenu from "@/layouts/header/header-menu"
import HeaderSubMenu from "@/layouts/header/header-sub-menu"

const Header: React.FC = () => {
    return (
        <div className={styles.header}>
            <HeaderMenu />
            <div className={styles.logo_block}>
                <Link href="/">
                    <Image
                        src="./images/logo_black.svg"
                        className={styles.logo}
                        alt="KOKORO logo black"
                        width="125"
                        height="24"
                        priority
                    />
                </Link>
            </div>
            <HeaderSubMenu />
        </div>
    )
}

export default Header
