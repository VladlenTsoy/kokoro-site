"use client"

import React, {useEffect, useMemo, useState} from "react"
import {createPortal} from "react-dom"
import {AnimatePresence, motion} from "framer-motion"
import styles from "./MobileHeaderMenu.module.css"
import Link from "next/link"
import Image from "next/image"
import {usePathname} from "next/navigation"
import MobileHeaderMenuIcon from "@/layouts/header/mobile-header-menu/MobileHeaderMenuIcon"
import type {CategoryWithSubCategoriesType} from "@/features/categories/CategoryType"
import {buildCategoryTree} from "@/features/categories/categoryTree"
import SearchForm from "@/components/search-form/SearchForm"

interface Props {
    isOpen: boolean
    onMenuToggle: () => void
    categories: CategoryWithSubCategoriesType[]
}

const toCollectionsPath = (path: string) => `/collections${path}`

const MobileHeaderMenu: React.FC<Props> = ({isOpen, onMenuToggle, categories}) => {
    const [mounted, setMounted] = useState(false)
    const [showCollections, setShowCollections] = useState(false)
    const pathname = usePathname()

    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories])

    const mobileCategories = useMemo(() => {
        if (categoryTree.length === 1) {
            return [categoryTree[0], ...categoryTree[0].sub_categories]
        }

        return categoryTree
    }, [categoryTree])

    const menuVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {duration: 0.2, staggerChildren: 0.08}
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2,
                staggerChildren: 0.08,
                staggerDirection: -1
            }
        }
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 16},
        visible: {opacity: 1, y: 0},
        exit: {opacity: 0, y: 16}
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        if (isOpen) {
            window.scrollTo(0, 0)
            document.body.style.overflow = "hidden"
            return
        }

        document.body.style.overflow = ""
        setShowCollections(false)

        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen, mounted])

    useEffect(() => {
        setShowCollections(false)
    }, [pathname])

    const onCategoryClick = () => {
        setShowCollections(false)
        onMenuToggle()
    }

    return (
        <>
            <MobileHeaderMenuIcon isOpen={isOpen} onClick={onMenuToggle} />
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className={`${styles.modal} ${showCollections ? styles.modal_collections : ""}`}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuVariants}
                        >
                            {!showCollections && (
                                <motion.div className={styles.modal_menu} variants={itemVariants}>
                                    <SearchForm mobile onSubmitComplete={onMenuToggle} />
                                    <Link href="/" onClick={onMenuToggle}>Главная</Link>
                                    <Link href="/about-us" onClick={onMenuToggle}>О Нас</Link>
                                    <button type="button" className={styles.menu_button} onClick={() => setShowCollections(true)}>
                                        Одежда
                                    </button>
                                </motion.div>
                            )}

                            {showCollections && (
                                <motion.div className={styles.collections_view} variants={itemVariants}>
                                    <button
                                        type="button"
                                        className={styles.back_button}
                                        onClick={() => setShowCollections(false)}
                                    >
                                        Назад
                                    </button>

                                    <div className={styles.categories_list}>
                                        {mobileCategories.map(category => (
                                            <Link
                                                key={category.id}
                                                href={toCollectionsPath(category.path)}
                                                className={styles.category_link}
                                                onClick={onCategoryClick}
                                            >
                                                {category.title}
                                            </Link>
                                        ))}
                                    </div>

                                    <Link href="/collections" className={styles.collection_banner} onClick={onCategoryClick}>
                                        <Image
                                            src="/images/2.jpg"
                                            alt="Collection"
                                            fill
                                            priority={false}
                                            sizes="100vw"
                                            className={styles.collection_banner_bg}
                                        />
                                        <div className={styles.collection_banner_overlay} />
                                        <div className={styles.collection_banner_title}>TANJIRO DEMON SLAYER</div>
                                        <div className={styles.collection_banner_tshirt}>
                                            <Image
                                                src="/images/t-shirt.png"
                                                alt="T-shirt"
                                                fill
                                                priority={false}
                                                sizes="70vw"
                                                className={styles.collection_banner_tshirt_image}
                                            />
                                        </div>
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}

export default MobileHeaderMenu
