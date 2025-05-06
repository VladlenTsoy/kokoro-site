"use client"

import React, {useState} from "react"
import styles from "./Input.module.css"

interface InputProps {
    placeholder?: string;
    label?: string;
    initValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style?: React.CSSProperties;
}

const Input: React.FC<InputProps> = ({label, initValue = "", onChange, placeholder, style}) => {
    const [value, setValue] = useState(initValue)
    const [isFocused, setIsFocused] = useState(initValue.length > 0)

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        onChange?.(e)
    }

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(value.length > 0)

    return (
        <div className={styles.container}>
            <label className={`${styles.label} ${isFocused ? styles.label_focused : ""}`}>
                {label}
            </label>
            <input
                style={style}
                type="text"
                placeholder={isFocused || !label ? placeholder : ""}
                value={value}
                onChange={onChangeHandler}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={styles.input}
            />
        </div>
    )
}

export default Input
