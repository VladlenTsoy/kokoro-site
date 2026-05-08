"use client"

import React, {useEffect, useId, useMemo, useRef, useState} from "react"
import styles from "./Select.module.css"
import cn from "classnames"
import {motion, AnimatePresence} from "framer-motion"
import getTextValue from "@/utils/getTextValue"

export interface OptionProps {
    color?: string
    title: string
    value: string | number
    disabled?: boolean
    hint?: string
}

interface SelectProps {
    options: OptionProps[]
    onChange?: (option: OptionProps) => void
}

const Select: React.FC<SelectProps> = ({options, onChange}) => {
    const selectId = useId()
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const hasOptions = options.length > 0
    const hasEnabledOptions = options.some(option => !option.disabled)
    const selected = useMemo(() => options[activeIndex], [activeIndex, options])

    const onClickHandler = () => {
        if (!hasOptions || !hasEnabledOptions) return
        setVisible(prevState => !prevState)
    }

    const onSelectHandler = (option: OptionProps, index: number) => {
        if (option.disabled) return
        setActiveIndex(index)
        setVisible(false)
        onChange?.(option)
    }

    useEffect(() => {
        if (!hasOptions) {
            setVisible(false)
            setActiveIndex(0)
            return
        }

        const safeIndex = Math.min(activeIndex, options.length - 1)
        const firstEnabledIndex = options.findIndex(option => !option.disabled)
        const nextIndex = options[safeIndex]?.disabled && firstEnabledIndex >= 0 ? firstEnabledIndex : safeIndex
        if (nextIndex !== activeIndex) {
            setActiveIndex(nextIndex)
        }
    }, [activeIndex, hasOptions, options])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node))
                setVisible(false)
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (!visible) return
            if (event.key === "Escape") {
                setVisible(false)
            }
        }

        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [visible])

    const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!hasOptions || !hasEnabledOptions) return

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            if (!visible) {
                setVisible(true)
                return
            }
            const delta = event.key === "ArrowDown" ? 1 : -1
            const nextIndex = (activeIndex + delta + options.length) % options.length
            onSelectHandler(options[nextIndex], nextIndex)
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setVisible(prev => !prev)
        }
    }

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <button
                type="button"
                className={cn(styles.select, {[styles.active]: visible, [styles.disabled]: !hasOptions || !hasEnabledOptions})}
                onClick={onClickHandler}
                onKeyDown={onTriggerKeyDown}
                aria-haspopup="listbox"
                aria-expanded={visible}
                aria-controls={`${selectId}-listbox`}
                disabled={!hasOptions || !hasEnabledOptions}
            >
                {selected?.color && <span className={styles.color} style={{background: selected.color}} />}
                <span>{getTextValue(selected?.title || "Нет вариантов")}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13.2802 5.96667L8.93355 10.3133C8.42021 10.8267 7.58021 10.8267 7.06688 10.3133L2.72021 5.96667"
                        stroke="#151515" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>
            </button>
            <AnimatePresence>
                {visible &&
                    <motion.div
                        id={`${selectId}-listbox`}
                        role="listbox"
                        aria-activedescendant={`${selectId}-option-${selected?.value ?? "none"}`}
                        className={styles.dropdown}
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.1}}
                    >
                        {options.map((option, key) =>
                            <button
                                id={`${selectId}-option-${option.value}`}
                                role="option"
                                aria-selected={option.value === selected?.value}
                                type="button"
                                className={cn(styles.option, "option", {[styles.optionDisabled]: option.disabled})}
                                key={option.value}
                                onClick={() => onSelectHandler(option, key)}
                                disabled={option.disabled}
                            >
                                {option?.color && <div className={styles.color} style={{background: option.color}} />}
                                <span>{getTextValue(option.title)}</span>
                                {option.hint && <span className={styles.hint}>{getTextValue(option.hint)}</span>}
                                {
                                    option.value === selected?.value &&
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M7.99998 14.6666C11.6666 14.6666 14.6666 11.6666 14.6666 7.99992C14.6666 4.33325 11.6666 1.33325 7.99998 1.33325C4.33331 1.33331 1.33331 4.33331 1.33331 7.99992C1.33331 11.6666 4.33331 14.6666 7.99998 14.6666Z"
                                            fill="#06A24F" />
                                        <path d="M5.16669 7.99995L7.05335 9.88661L10.8334 6.11328" stroke="#F9F9F9"
                                              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                            </button>
                        )}
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}

export default Select
