"use client"

import React, {useState} from "react"
import styles from "./Input.module.css"

interface InputProps {
    placeholder?: string
    label?: string
    initValue?: string
    value?: string
    type?: React.HTMLInputTypeAttribute
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    style?: React.CSSProperties
}

const Input: React.FC<InputProps> = (
    {
        label,
        initValue = "",
        value,
        type = "text",
        inputMode,
        onChange,
        onFocus,
        onBlur,
        placeholder,
        style
    }
) => {
    const isControlled = typeof value === "string"
    const [localValue, setLocalValue] = useState(initValue)
    const [isFocused, setIsFocused] = useState(initValue.length > 0)
    const resolvedValue = isControlled ? value : localValue

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
            setLocalValue(e.target.value)
        }
        onChange?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)
        onFocus?.(e)
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(resolvedValue.length > 0)
        onBlur?.(e)
    }

    return (
        <div className={styles.container}>
            <label className={`${styles.label} ${isFocused ? styles.label_focused : ""}`}>
                {label}
            </label>
            <input
                style={style}
                type={type}
                inputMode={inputMode}
                placeholder={isFocused || !label ? placeholder : ""}
                value={resolvedValue}
                onChange={onChangeHandler}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={styles.input}
            />
        </div>
    )
}

export default Input
