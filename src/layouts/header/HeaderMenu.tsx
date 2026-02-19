"use client"

import React, {useEffect, useRef, useState} from "react"
import styles from "./HeaderMenu.module.css"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {type CategoryWithSubCategoriesType} from "@/features/categories/CategoryType"
import MenuCategories from "@/layouts/header/menu-categories/MenuCategories"
import MobileHeaderMenu from "@/layouts/header/mobile-header-menu/MobileHeaderMenu"

interface Props {
    categories: CategoryWithSubCategoriesType[]
}

const HeaderMenu: React.FC<Props> = ({categories}) => {
    const pathname = usePathname()

    const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)
    const [isOpenCollectionMenu, setIsOpenCollectionMenu] = useState(false)
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const onClickToggleMobileMenu = () => {
        setIsOpenMobileMenu(prev => !prev)
    }

    const keepCollectionMenuOpen = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current)
        }
    }

    const openCollectionMenu = () => {
        keepCollectionMenuOpen()
        setIsOpenCollectionMenu(true)
    }

    const closeCollectionMenu = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current)
        }
        closeTimerRef.current = setTimeout(() => {
            setIsOpenCollectionMenu(false)
        }, 120)
    }

    useEffect(() => {
        setIsOpenMobileMenu(false)
        setIsOpenCollectionMenu(false)
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current)
        }
    }, [pathname])

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
            }
        }
    }, [])

    return (
        <>
            <div
                className={styles.menu_wrapper}
            >
                <div className={styles.menu}>
                    <Link href="/">Главная</Link>
                    <Link href="/about-us">О Нас</Link>
                    <Link
                        href="/collections"
                        className={styles.collection_trigger}
                        onMouseLeave={closeCollectionMenu}
                        onMouseEnter={openCollectionMenu}
                    >
                        Коллекция
                    </Link>
                </div>
            </div>
            <MobileHeaderMenu
                isOpen={isOpenMobileMenu}
                onMenuToggle={onClickToggleMobileMenu}
            />
            <MenuCategories
                isOpen={isOpenCollectionMenu}
                categories={categories}
                onClose={() => setIsOpenCollectionMenu(false)}
                onMouseEnter={keepCollectionMenuOpen}
            />
        </>
    )
}

export default HeaderMenu
