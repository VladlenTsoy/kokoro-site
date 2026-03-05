"use client"

import React from "react"
import styles from "./page.module.css"
import {motion} from "framer-motion"
import BannerSocial from "@/components/banner-social/BannerSocial"

const AboutUsContent = () => {
    return (
        <div className={styles.banner}>
            <div className={styles.banner_image}>
                <motion.div
                    className={styles.content}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, ease: "easeOut"}}
                >
                    <h1 className={styles.title}>О нас</h1>
                    <p className={styles.text}>
                        KOKORO — это бренд, который объединяет страсть к стилю, качеству и уникальным историям.
                        Мы создаём одежду и аксессуары, вдохновляясь японской эстетикой, современным урбан-культурой
                        и духом приключений.
                    </p>
                    <p className={styles.text}>
                        Наша цель — не просто одевать, а создавать эмоции. Каждая вещь KOKORO продумана до мелочей:
                        от дизайна до материалов, чтобы вы могли выразить свою индивидуальность и чувствовать себя
                        уверенно в любом городе мира.
                    </p>
                    <p className={styles.text}>
                        Мы верим, что мода — это язык, который рассказывает о вас больше, чем слова. С KOKORO каждый
                        ваш день становится маленьким приключением.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.image_wrap}
                    initial={{opacity: 0, y: 30, scale: 0.98}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    transition={{duration: 0.7, delay: 0.15, ease: "easeOut"}}
                >
                    <video
                        className={styles.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                    >
                        <source src="/banner.mp4" type="video/mp4" />
                    </video>
                    <div className={styles.fade_to_image} />
                </motion.div>
                <div className={styles.banner_socials}>
                    <BannerSocial name="Instagram" link="https://www.instagram.com/kokoro.mode/" />
                    <BannerSocial name="Telegram" link="https://t.me/kokoro_wear" />
                </div>
            </div>
        </div>
    )
}

export default AboutUsContent
