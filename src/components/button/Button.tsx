import React, {MouseEventHandler} from "react"
import styles from "./Button.module.css"
import cn from "classnames"

interface ButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    children?: React.ReactNode
    block?: boolean
}

const Button: React.FC<ButtonProps> = ({children, onClick, block}) => {
    return (
        <button className={cn(styles.button, {[styles.block]: block})} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button
