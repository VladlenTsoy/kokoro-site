"use client"

import React, {useEffect, useState} from "react"
import styles from "./HeaderMenu.module.css"
import Link from "next/link"
import {AnimatePresence, motion} from "framer-motion"
import {createPortal} from "react-dom"
import {usePathname} from "next/navigation"

const HeaderMenu = () => {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const onClickHandler = () => {
        setIsOpen(prevState => !prevState)
    }

    const menuVariants = {
        hidden: {opacity: 0},
        visible: {opacity: 1, transition: {duration: 0.2, staggerChildren: 0.1}},
        exit: {opacity: 0, transition: {duration: 0.2, staggerChildren: 0.1, staggerDirection: -1}}
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {opacity: 1, y: 0},
        exit: {opacity: 0, y: 50}
    }

    useEffect(() => {
        if (isOpen) {
            window.scrollTo(0, 0)
            document.body.style.overflow = "hidden"
        } else
            document.body.style.overflow = ""

        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return (
        <>
            <div className={styles.menu}>
                <Link href="/">Главная</Link>
                <Link href="/about-us">О Нас</Link>
                <Link href="/#collection">Коллекция</Link>
            </div>
            <div className={styles.m_menu} onClick={onClickHandler}>
                <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            {
                createPortal(
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                className={styles.modal}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={menuVariants}
                            >
                                <motion.div className={styles.modal_menu}>
                                    <motion.div variants={itemVariants}>
                                        <Link href="/">Главная</Link>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <Link href="/about-us">О Нас</Link>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <Link href="/#collection">Коллекция</Link>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )
            }
        </>
    )
}

export default HeaderMenu
