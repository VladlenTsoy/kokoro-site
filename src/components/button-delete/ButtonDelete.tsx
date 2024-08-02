import React from "react"
import styles from "./ButtonDelete.module.css"

interface ButtonDeleteProps {
    onClick?: () => void
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({onClick}) => {
    return (
        <button className={styles.btn_delete} onClick={onClick}>
            <svg width="30" height="31" viewBox="0 0 30 31" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M26.25 7.97498C22.0875 7.56248 17.9 7.34998 13.725 7.34998C11.25 7.34998 8.775 7.47498 6.3 7.72498L3.75 7.97498"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path
                    d="M10.625 6.7125L10.9 5.075C11.1 3.8875 11.25 3 13.3625 3H16.6375C18.75 3 18.9125 3.9375 19.1 5.0875L19.375 6.7125"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path
                    d="M23.5625 11.925L22.75 24.5125C22.6125 26.475 22.5 28 19.0125 28H10.9875C7.5 28 7.3875 26.475 7.25 24.5125L6.4375 11.925"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.9126 21.125H17.0751" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.875 16.125H18.125" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    )
}

export default ButtonDelete
