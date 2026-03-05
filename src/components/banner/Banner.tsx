import React from "react"
import styles from "./Banner.module.css"
import BannerSocial from "@/components/banner-social/BannerSocial"

interface BannerProps {
    title: React.ReactNode
}

const Banner:React.FC<BannerProps> = ({title}) => {
    return (
        <div className={styles.banner}>
            <div className={styles.banner_image}>
                <video
                    className={styles.banner_video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                >
                    <source src="/banner.mp4" type="video/mp4" />
                </video>
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
