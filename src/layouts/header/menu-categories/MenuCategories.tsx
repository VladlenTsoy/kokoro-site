import React, {useEffect, useState} from "react"
import {createPortal} from "react-dom"
import {AnimatePresence, motion} from "framer-motion"
import styles from "./MenuCategories.module.css"
import Link from "next/link"
import type {CategoryWithSubCategoriesType} from "@/features/categories/CategoryType"

interface Props {
    isOpen: boolean
    categories: CategoryWithSubCategoriesType[]
    onClose: () => void
    onMouseEnter: () => void
}

const MenuCategories: React.FC<Props> = ({isOpen, categories, onClose, onMouseEnter}) => {
    const [mounted, setMounted] = useState(false)

    const onCategoryLinkClick = () => {
        onClose()
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if(!mounted) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.collection_menu}
                    style={{top: `74px`}}
                    initial={{opacity: 0, y: -8}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -8}}
                    transition={{duration: 0.2, ease: "easeOut"}}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onClose}
                >
                    <div className={styles.collection_list}>
                        {categories.map(category => (
                            <div key={category.id} className={styles.collection_column}>
                                <Link
                                    href={`/collections/${category.url}`}
                                    className={styles.collection_root_link}
                                    onClick={onCategoryLinkClick}
                                >
                                    {category.title}
                                </Link>
                                {category?.sub_categories && category.sub_categories.length > 0 && (
                                    <div className={styles.collection_sublist}>
                                        {category.sub_categories.map(subCategory => (
                                            <Link
                                                key={subCategory.id}
                                                href={`/collections/${category.url}/${subCategory.url}`}
                                                className={styles.collection_subitem}
                                                onClick={onCategoryLinkClick}
                                            >
                                                {subCategory.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={styles.collection_banner}>
                        <div className={styles.banner}></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )

}

export default MenuCategories