import React from "react"
import styles from "./Banner.module.css"
import Image from "next/image"

const Banner = () => {
    return (
        <div className={styles.banner}>
            <div className={styles.banner_image}>
                <Image src="/images/banner-tmp.png" alt="banner" objectFit="contain" layout="fill" priority={false} />
            </div>
        </div>
    )
}

export default Banner
