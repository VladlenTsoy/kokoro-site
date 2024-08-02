"use client"

import React, {useState} from "react"
import styles from "./Counter.module.css"

interface CounterProps {
    defaultValue?: number
    onChange?: (value: number) => void
    min?: number
    max?: number
}

const Counter: React.FC<CounterProps> = (
    {
        defaultValue = 0,
        onChange,
        min = 0,
        max = Infinity
    }
) => {
    const [value, setValue] = useState(defaultValue)

    const onClickPlusHandler = () => {
        setValue(prevValue => {
            const newValue = Math.min(prevValue + 1, max)
            if (onChange) onChange(newValue)
            return newValue
        })
    }

    const onClickMinusHandler = () => {
        setValue(prevValue => {
            const newValue = Math.max(prevValue - 1, min)
            if (onChange) onChange(newValue)
            return newValue
        })
    }

    return (
        <div className={styles.counter}>
            <button className={styles.btn} onClick={onClickMinusHandler}>
                <svg width="19" height="3" viewBox="0 0 19 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5H17.3333" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round"
                          strokeLinejoin="round" />
                </svg>
            </button>
            <div className={styles.value}>{value}</div>
            <button className={styles.btn} onClick={onClickPlusHandler}>
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 8.91663H17.3333" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round"
                          strokeLinejoin="round" />
                    <path d="M9.41992 16.8333V1" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round"
                          strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    )
}

export default Counter
