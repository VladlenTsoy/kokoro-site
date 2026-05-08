"use client"

import React, {useState} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import cn from "classnames"
import styles from "./SearchForm.module.css"

interface SearchFormProps {
    compact?: boolean
    mobile?: boolean
    onSubmitComplete?: () => void
}

const SearchForm: React.FC<SearchFormProps> = ({compact, mobile, onSubmitComplete}) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get("q") || "")

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const normalizedQuery = query.trim()
        if (!normalizedQuery) return

        router.push(`/search?q=${encodeURIComponent(normalizedQuery)}`)
        onSubmitComplete?.()
    }

    return (
        <form className={cn(styles.form, {[styles.compact]: compact, [styles.mobile]: mobile})} onSubmit={onSubmit} role="search">
            <input
                className={styles.input}
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Поиск по каталогу"
                aria-label="Поиск по каталогу"
            />
            <button className={styles.button} type="submit">Найти</button>
        </form>
    )
}

export default SearchForm
