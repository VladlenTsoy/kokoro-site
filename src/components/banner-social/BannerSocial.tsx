import React from "react"
import styles from "./BannerSocial.module.css"
import Link from "next/link"

interface BannerSocialProps {
    name: string
    link: string
}

const BannerSocial: React.FC<BannerSocialProps> = ({name, link}) => {
    return (
        <a className={styles.social} href={link} target="_blank" rel="noopener noreferrer" aria-label="name">
            <div>{name}</div>
            <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.2422 8.75H18.5422V14.0625" stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5438 8.75L11.4688 15.825" stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 19.7871C12.3625 21.4121 17.6375 21.4121 22.5 19.7871" stroke="white"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </a>
    )
}

export default BannerSocial
