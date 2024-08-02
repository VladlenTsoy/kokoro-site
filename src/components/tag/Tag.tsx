import React from "react"
import styles from "./Tag.module.css"

interface TagProps {
    children: React.ReactNode
}

const Tag: React.FC<TagProps> = ({children}) => {
    return (
        <div className={styles.tag}>
            {children}
        </div>
    )
}

export default Tag
