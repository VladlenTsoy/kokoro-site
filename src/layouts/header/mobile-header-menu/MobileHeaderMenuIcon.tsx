import React from "react"
import styles from "./MobileHeaderMenuIcon.module.css"
import {motion} from "framer-motion"

interface Props {
    isOpen: boolean
    onClick: () => void
}

const MobileHeaderMenuIcon:React.FC<Props> = ({isOpen, onClick}) => {
    return (
        <div className={styles.m_menu} onClick={onClick}>
            <svg width="40" height="41" viewBox="0 0 40 41" fill="none">
                <motion.path
                    d="M11 15.5H29"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    animate={isOpen ? {rotate: 45, y: 5} : {rotate: 0, y: 0}}
                    transition={{duration: 0.3}}
                />
                <motion.path
                    d="M11 20.5H29"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    animate={isOpen ? {opacity: 0} : {opacity: 1}}
                    transition={{duration: 0.3}}
                />
                <motion.path
                    d="M11 25.5H29"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    animate={isOpen ? {rotate: -45, y: -5} : {rotate: 0, y: 0}}
                    transition={{duration: 0.3}}
                />
            </svg>
        </div>
    )
}

export default MobileHeaderMenuIcon