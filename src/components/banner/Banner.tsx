import React from "react"
import styles from "./Banner.module.css"
import Image from "next/image"
import BannerSocial from "@/components/banner-social/BannerSocial"

interface BannerProps {
    title: React.ReactNode
}

const Banner:React.FC<BannerProps> = ({title}) => {
    return (
        <div className={styles.banner}>
            <div className={styles.banner_image}>
                <Image src="/images/banner-tmp.png" alt="banner" fill priority={false} />
                <h2 className={styles.banner_title}>{title}</h2>
                <div className={styles.banner_socials}>
                    <BannerSocial name="Instagram" link="https://www.instagram.com/kokoro.mode/" />
                    <BannerSocial name="Telegram" link="https://t.me/kokoro_wear" />
                </div>
            </div>
        </div>
    )
}

export default Banner
