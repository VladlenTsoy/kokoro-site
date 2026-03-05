"use client"

import React, {useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import styles from "./ProductDetailsCollapse.module.css"

interface CollapseItem {
    label: string
    content: React.ReactNode
}

interface ProductDetailsCollapseProps {
    items: CollapseItem[]
}

const ProductDetailsCollapse: React.FC<ProductDetailsCollapseProps> = ({items}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const onToggle = (index: number) => {
        setActiveIndex(prev => (prev === index ? -1 : index))
    }

    return (
        <div className={styles.collapse}>
            {items.map((item, index) => {
                const isActive = index === activeIndex

                return (
                    <div key={`${item.label}-${index}`} className={styles.item}>
                        <button
                            type="button"
                            className={`${styles.header} ${isActive ? styles.active : ""}`}
                            onClick={() => onToggle(index)}
                        >
                            <span>{item.label}</span>
                            <span className={styles.icon}>{isActive ? "−" : "+"}</span>
                        </button>
                        <AnimatePresence initial={false}>
                            {isActive && (
                                <motion.div
                                    className={styles.content_wrap}
                                    initial={{height: 0, opacity: 0}}
                                    animate={{height: "auto", opacity: 1}}
                                    exit={{height: 0, opacity: 0}}
                                    transition={{duration: 0.2, ease: "easeOut"}}
                                >
                                    <div className={styles.content}>
                                        {item.content}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}
        </div>
    )
}

export default ProductDetailsCollapse
