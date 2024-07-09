"use client"

import React, {useEffect, useRef, useState} from "react"
import styles from "./Select.module.css"
import cn from "classnames"
import {motion, AnimatePresence} from "framer-motion"

interface OptionProps {
    color?: string
    title: string
    value: string | number
}

interface SelectProps {
    options: OptionProps[]
}

const Select: React.FC<SelectProps> = ({options}) => {
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState<OptionProps>(options[0])
    const selectRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const onClickHandler = () => {
        setVisible(prevState => !prevState)
    }

    const onSelectHandler = (option: OptionProps) => {
        setSelected(option)
        setVisible(false)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
                setVisible(false)
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [dropdownRef])

    return (
        <div className={styles.wrapper}>
            <div ref={selectRef} className={cn(styles.select, {[styles.active]: visible})} onClick={onClickHandler}>
                {selected?.color && <div className={styles.color} style={{background: selected.color}} />}
                <span>{selected?.title}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13.2802 5.96667L8.93355 10.3133C8.42021 10.8267 7.58021 10.8267 7.06688 10.3133L2.72021 5.96667"
                        stroke="#151515" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>
            </div>
            <AnimatePresence>
                {visible &&
                    <motion.div
                        ref={dropdownRef}
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{duration: 0.1}}
                    >
                        {options.map((option, key) =>
                            <div className={cn(styles.option, "option")} key={key}
                                 onClick={() => onSelectHandler(option)}>
                                {option?.color && <div className={styles.color} style={{background: option.color}} />}
                                {option.title}
                                {
                                    option.value === selected.value &&
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M7.99998 14.6666C11.6666 14.6666 14.6666 11.6666 14.6666 7.99992C14.6666 4.33325 11.6666 1.33325 7.99998 1.33325C4.33331 1.33325 1.33331 4.33325 1.33331 7.99992C1.33331 11.6666 4.33331 14.6666 7.99998 14.6666Z"
                                            fill="#06A24F" />
                                        <path d="M5.16669 7.99995L7.05335 9.88661L10.8334 6.11328" stroke="#F9F9F9"
                                              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                            </div>
                        )}
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}

export default Select
