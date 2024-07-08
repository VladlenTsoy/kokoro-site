import React, {MouseEventHandler} from "react"
import styles from "./Button.module.css"

interface ButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>,
    children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({children, onClick}) => {
    return (
        <button className={styles.button} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button
