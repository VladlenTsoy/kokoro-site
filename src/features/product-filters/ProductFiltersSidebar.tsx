"use client"

import React from "react"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import styles from "./ProductFiltersSidebar.module.css"
import {parseQueryIds, serializeQueryIds} from "@/utils/queryIds"

interface ColorFilterOption {
    id: number
    title: string
    hex?: string | null
}

interface SizeFilterOption {
    id: number
    title: string
}

type SortValue = "newest" | "price_asc" | "price_desc" | "oldest"

interface ProductFiltersSidebarProps {
    colors: ColorFilterOption[]
    sizes: SizeFilterOption[]
}

const SORT_OPTIONS: {value: SortValue; label: string; hint: string}[] = [
    {value: "newest", label: "Сначала новые", hint: "новинки выше"},
    {value: "price_asc", label: "Цена: по возрастанию", hint: "дешевле выше"},
    {value: "price_desc", label: "Цена: по убыванию", hint: "дороже выше"},
    {value: "oldest", label: "Сначала старые", hint: "старые выше"}
]

const ProductFiltersSidebar: React.FC<ProductFiltersSidebarProps> = ({colors, sizes}) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const selectedColorIds = parseQueryIds(searchParams.getAll("colorIds").length ? searchParams.getAll("colorIds") : searchParams.get("colorIds") || undefined)
    const selectedSizeIds = parseQueryIds(searchParams.getAll("sizeIds").length ? searchParams.getAll("sizeIds") : searchParams.get("sizeIds") || undefined)
    const selectedSort = (searchParams.get("sortBy") || "newest") as SortValue
    const activeFiltersCount = selectedColorIds.length + selectedSizeIds.length

    const pushQuery = (next: URLSearchParams) => {
        next.set("page", "1")
        const query = next.toString()
        router.push(query ? `${pathname}?${query}` : pathname)
    }

    const updateQuery = (nextColorIds: number[], nextSizeIds: number[]) => {
        const next = new URLSearchParams(searchParams.toString())

        const colorValue = serializeQueryIds(nextColorIds)
        const sizeValue = serializeQueryIds(nextSizeIds)

        if (colorValue) next.set("colorIds", colorValue)
        else next.delete("colorIds")

        if (sizeValue) next.set("sizeIds", sizeValue)
        else next.delete("sizeIds")

        pushQuery(next)
    }

    const setSort = (sortBy: SortValue) => {
        const next = new URLSearchParams(searchParams.toString())
        if (sortBy === "newest") next.delete("sortBy")
        else next.set("sortBy", sortBy)
        pushQuery(next)
    }

    const toggleColor = (id: number) => {
        const exists = selectedColorIds.includes(id)
        const nextColorIds = exists
            ? selectedColorIds.filter(item => item !== id)
            : [...selectedColorIds, id]

        updateQuery(nextColorIds, selectedSizeIds)
    }

    const toggleSize = (id: number) => {
        const exists = selectedSizeIds.includes(id)
        const nextSizeIds = exists
            ? selectedSizeIds.filter(item => item !== id)
            : [...selectedSizeIds, id]

        updateQuery(selectedColorIds, nextSizeIds)
    }

    const resetFilters = () => {
        const next = new URLSearchParams(searchParams.toString())
        next.delete("colorIds")
        next.delete("sizeIds")
        pushQuery(next)
    }

    const resetAll = () => {
        const next = new URLSearchParams(searchParams.toString())
        next.delete("colorIds")
        next.delete("sizeIds")
        next.delete("sortBy")
        pushQuery(next)
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Подбор</h3>
                    <div className={styles.subtitle}>{activeFiltersCount ? `Выбрано: ${activeFiltersCount}` : "Цвет, размер и сортировка"}</div>
                </div>
                <button type="button" className={styles.reset} onClick={resetAll}>
                    Сбросить всё
                </button>
            </div>

            <div className={styles.block}>
                <div className={styles.block_title}>Сортировка</div>
                <div className={styles.sort_options}>
                    {SORT_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            className={`${styles.sort_option} ${selectedSort === option.value ? styles.sort_option_active : ""}`}
                            onClick={() => setSort(option.value)}
                        >
                            <span>{option.label}</span>
                            <small>{option.hint}</small>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.block}>
                <div className={styles.block_head}>
                    <div className={styles.block_title}>Цвета</div>
                    {!!selectedColorIds.length && <button type="button" className={styles.inline_reset} onClick={() => updateQuery([], selectedSizeIds)}>Очистить</button>}
                </div>
                <div className={styles.options}>
                    {colors.map(color => (
                        <label key={color.id} className={styles.option}>
                            <input
                                className={styles.checkbox_input}
                                type="checkbox"
                                checked={selectedColorIds.includes(color.id)}
                                onChange={() => toggleColor(color.id)}
                            />
                            <span className={styles.checkbox} />
                            <span className={styles.option_label}>
                                <span
                                    className={styles.color_dot}
                                    style={{backgroundColor: color.hex || "#ddd"}}
                                />
                                {color.title}
                            </span>
                        </label>
                    ))}
                    {colors.length === 0 && <div className={styles.empty}>Нет доступных цветов</div>}
                </div>
            </div>

            <div className={styles.block}>
                <div className={styles.block_head}>
                    <div className={styles.block_title}>Размеры</div>
                    {!!selectedSizeIds.length && <button type="button" className={styles.inline_reset} onClick={() => updateQuery(selectedColorIds, [])}>Очистить</button>}
                </div>
                <div className={styles.size_options}>
                    {sizes.map(size => (
                        <button
                            key={size.id}
                            type="button"
                            className={`${styles.size_option} ${selectedSizeIds.includes(size.id) ? styles.size_option_active : ""}`}
                            onClick={() => toggleSize(size.id)}
                        >
                            {size.title}
                        </button>
                    ))}
                    {sizes.length === 0 && <div className={styles.empty}>Нет доступных размеров</div>}
                </div>
            </div>

            {!!activeFiltersCount && (
                <button type="button" className={styles.apply_reset} onClick={resetFilters}>
                    Очистить фильтры
                </button>
            )}
        </aside>
    )
}

export default ProductFiltersSidebar
