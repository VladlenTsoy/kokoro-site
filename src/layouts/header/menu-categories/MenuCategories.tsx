import React, {useEffect, useMemo, useState} from "react"
import {createPortal} from "react-dom"
import {AnimatePresence, motion} from "framer-motion"
import styles from "./MenuCategories.module.css"
import Link from "next/link"
import Image from "next/image"
import type {CategoryWithSubCategoriesType} from "@/features/categories/CategoryType"
import {buildCategoryTree, type CategoryTreeItem} from "@/features/categories/categoryTree"

interface Props {
    isOpen: boolean
    categories: CategoryWithSubCategoriesType[]
    onClose: () => void
    onMouseEnter: () => void
    onMouseLeave: () => void
}

const toCollectionsPath = (path: string) => `/collections${path}`

const renderSubCategories = (items: CategoryTreeItem[], onCategoryLinkClick: () => void, level = 0): React.ReactNode => {
    if (!items.length) return null

    return (
        <div className={styles.collection_sublist}>
            {items.map(item => (
                <React.Fragment key={item.id}>
                    <Link
                        href={toCollectionsPath(item.path)}
                        className={styles.collection_subitem}
                        style={{paddingLeft: `${32 + level * 14}px`}}
                        onClick={onCategoryLinkClick}
                    >
                        {item.title}
                    </Link>
                    {renderSubCategories(item.sub_categories, onCategoryLinkClick, level + 1)}
                </React.Fragment>
            ))}
        </div>
    )
}

const MenuCategories: React.FC<Props> = ({isOpen, categories, onClose, onMouseEnter, onMouseLeave}) => {
    const [mounted, setMounted] = useState(false)

    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories])

    const onCategoryLinkClick = () => {
        onClose()
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.collection_menu}
                    style={{top: "74px"}}
                    initial={{opacity: 0, y: -8}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -8}}
                    transition={{duration: 0.2, ease: "easeOut"}}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <div className={styles.collection_list}>
                        {categoryTree.map(category => (
                            <div key={category.id} className={styles.collection_column}>
                                <Link
                                    href={toCollectionsPath(category.path)}
                                    className={styles.collection_root_link}
                                    onClick={onCategoryLinkClick}
                                >
                                    {category.title}
                                </Link>
                                {renderSubCategories(category.sub_categories, onCategoryLinkClick)}
                            </div>
                        ))}
                    </div>
                    <div className={styles.collection_banner}>
                        <Link href="/collections" onClick={onCategoryLinkClick} className={styles.banner}>
                            <Image
                                src="/images/2.jpg"
                                alt="KOKORO collection"
                                fill
                                priority={false}
                                sizes="(max-width: 1400px) 48vw, 44vw"
                                className={styles.banner_bg}
                            />
                            <div className={styles.banner_overlay} />
                            <div className={styles.banner_text}>
                                <div className={styles.banner_title}>TANJIRO DEMON SLAYER</div>
                                <div className={styles.banner_description}>
                                    Вымышленный персонаж, выступающий в роли главного протагониста аниме и манги
                                    «Истребитель демонов».
                                </div>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default MenuCategories
