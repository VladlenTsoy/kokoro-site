"use client"

import React, {useEffect, useState} from "react"
import {createPortal} from "react-dom"
import {AnimatePresence, motion} from "framer-motion"
import styles from "./Popover.module.css"

interface PopoverProps {
    open: boolean
    anchorRef: React.RefObject<HTMLElement>
    children: React.ReactNode
    width?: number
    align?: "left" | "right"
    offset?: number
    arrowOffset?: number
    usePortal?: boolean
    sticky?: boolean
}

const Popover: React.FC<PopoverProps> = (
    {
        open,
        anchorRef,
        children,
        width = 220,
        align = "right",
        offset = 8,
        arrowOffset = 18,
        usePortal = true,
        sticky = false
    }
) => {
    const [container, setContainer] = useState<HTMLElement | null>(null)
    const [position, setPosition] = useState<{top: number; left: number} | null>(null)

    useEffect(() => {
        if (!usePortal) return
        const el = document.createElement("div")
        el.setAttribute("data-popover-root", "")
        document.body.appendChild(el)
        setContainer(el)

        return () => {
            if (el.parentNode) {
                el.parentNode.removeChild(el)
            }
            setContainer(null)
        }
    }, [usePortal])

    const updatePosition = () => {
        const anchor = anchorRef.current
        if (!anchor) return
        const rect = anchor.getBoundingClientRect()
        const top = rect.bottom + offset
        const left = align === "right" ? rect.right - width : rect.left
        setPosition({top, left})
    }

    useEffect(() => {
        if (!open) return
        updatePosition()
        const handle = () => updatePosition()
        window.addEventListener("resize", handle)
        window.addEventListener("scroll", handle, true)
        return () => {
            window.removeEventListener("resize", handle)
            window.removeEventListener("scroll", handle, true)
        }
    }, [open, align, offset, width, anchorRef])

    const content = (
        <AnimatePresence>
            {open && position && (
                <motion.div
                    className={styles.popover}
                    style={{
                        width,
                        top: position.top,
                        left: position.left,
                        position: sticky ? "fixed" : "absolute"
                    }}
                    initial={{opacity: 0, y: 10, scale: 0.98}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: 6, scale: 0.98}}
                    transition={{duration: 0.2}}
                >
                    <div
                        className={styles.arrow}
                        style={{
                            ...(align === "right"
                                ? {right: Math.max(8, arrowOffset)}
                                : {left: Math.max(8, arrowOffset)})
                        }}
                    />
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )

    if (!usePortal) return content

    if (!container) return null

    return createPortal(content, container)
}

export default Popover
