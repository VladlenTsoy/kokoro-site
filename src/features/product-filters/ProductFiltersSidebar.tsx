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

interface ProductFiltersSidebarProps {
    colors: ColorFilterOption[]
    sizes: SizeFilterOption[]
}

const ProductFiltersSidebar: React.FC<ProductFiltersSidebarProps> = ({colors, sizes}) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const selectedColorIds = parseQueryIds(searchParams.getAll("colorIds").length ? searchParams.getAll("colorIds") : searchParams.get("colorIds") || undefined)
    const selectedSizeIds = parseQueryIds(searchParams.getAll("sizeIds").length ? searchParams.getAll("sizeIds") : searchParams.get("sizeIds") || undefined)

    const updateQuery = (nextColorIds: number[], nextSizeIds: number[]) => {
        const next = new URLSearchParams(searchParams.toString())

        const colorValue = serializeQueryIds(nextColorIds)
        const sizeValue = serializeQueryIds(nextSizeIds)

        if (colorValue) next.set("colorIds", colorValue)
        else next.delete("colorIds")

        if (sizeValue) next.set("sizeIds", sizeValue)
        else next.delete("sizeIds")

        next.set("page", "1")

        const query = next.toString()
        router.push(query ? `${pathname}?${query}` : pathname)
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
        updateQuery([], [])
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h3 className={styles.title}>Фильтр</h3>
                <button type="button" className={styles.reset} onClick={resetFilters}>
                    Сбросить
                </button>
            </div>

            <div className={styles.block}>
                <div className={styles.block_title}>Цвета</div>
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
                <div className={styles.block_title}>Размеры</div>
                <div className={styles.options}>
                    {sizes.map(size => (
                        <label key={size.id} className={styles.option}>
                            <input
                                className={styles.checkbox_input}
                                type="checkbox"
                                checked={selectedSizeIds.includes(size.id)}
                                onChange={() => toggleSize(size.id)}
                            />
                            <span className={styles.checkbox} />
                            <span className={styles.option_label}>{size.title}</span>
                        </label>
                    ))}
                    {sizes.length === 0 && <div className={styles.empty}>Нет доступных размеров</div>}
                </div>
            </div>
        </aside>
    )
}

export default ProductFiltersSidebar
