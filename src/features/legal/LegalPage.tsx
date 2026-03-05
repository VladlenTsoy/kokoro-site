import React from "react"
import Container from "@/layouts/container/Container"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import styles from "./LegalPage.module.css"

interface LegalSection {
    title: string
    paragraphs?: string[]
    list?: string[]
}

interface LegalPageProps {
    title: string
    updatedAt: string
    sections: LegalSection[]
}

const LegalPage: React.FC<LegalPageProps> = ({title, updatedAt, sections}) => {
    return (
        <Container>
            <div className={styles.page}>
                <Breadcrumb items={[{label: title, isCurrent: true}]} />
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.meta}>Актуально на: {updatedAt}</div>
                {sections.map(section => (
                    <section key={section.title} className={styles.section}>
                        <h2 className={styles.section_title}>{section.title}</h2>
                        {section.paragraphs?.map(text => (
                            <p key={text} className={styles.section_text}>{text}</p>
                        ))}
                        {section.list && (
                            <ul className={styles.list}>
                                {section.list.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}
            </div>
        </Container>
    )
}

export default LegalPage
