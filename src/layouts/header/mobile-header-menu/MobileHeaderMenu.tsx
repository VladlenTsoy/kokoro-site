import React, {useEffect, useState} from "react"
import {createPortal} from "react-dom"
import {AnimatePresence, motion} from "framer-motion"
import styles from "./MobileHeaderMenu.module.css"
import Link from "next/link"
import MobileHeaderMenuIcon from "@/layouts/header/mobile-header-menu/MobileHeaderMenuIcon"

interface Props {
    isOpen: boolean
    onMenuToggle: () => void
}

const MobileHeaderMenu: React.FC<Props> = ({isOpen, onMenuToggle}) => {
    const [mounted, setMounted] = useState(false)

    const menuVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {duration: 0.2, staggerChildren: 0.1}
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2,
                staggerChildren: 0.1,
                staggerDirection: -1
            }
        }
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {opacity: 1, y: 0},
        exit: {opacity: 0, y: 50}
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        if (isOpen) {
            window.scrollTo(0, 0)
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }

        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen, mounted])

    return (
        <>
            <MobileHeaderMenuIcon isOpen={isOpen} onClick={onMenuToggle} />
            {
                mounted && createPortal(
                    <>
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
                        </AnimatePresence>
                    </>,
                    document.body
                )
            }
        </>
    )
}

export default MobileHeaderMenu