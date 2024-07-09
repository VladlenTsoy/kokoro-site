"use client"

import React, {useState} from "react"
import styles from "./Tabs.module.css"

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({tabs}) => {
    const [activeTab, setActiveTab] = useState<number>(0)

    const handleTabClick = (index: number) => {
        setActiveTab(index)
    }

    return (
        <div className={styles.tabs}>
            <div className={styles.tab_buttons}>
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`${styles.tab_button} ${index === activeTab ? styles.active : ""}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className={styles.tab_content}>
                {tabs[activeTab].content}
            </div>
        </div>
    )
}

export default Tabs
