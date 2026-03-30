import React, {MouseEventHandler} from "react"
import styles from "./Button.module.css"
import cn from "classnames"

interface ButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    children?: React.ReactNode
    block?: boolean
    disabled?: boolean
    type?: "button" | "submit" | "reset"
}

const Button: React.FC<ButtonProps> = ({children, onClick, block, disabled = false, type = "button"}) => {
    return (
        <button
            type={type}
            className={cn(styles.button, {[styles.block]: block, [styles.disabled]: disabled})}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
