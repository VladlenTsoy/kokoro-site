import React from "react"
import {notFound} from "next/navigation"
import Link from "next/link"
import styles from "./page.module.css"
import {buildCategoryTree, findCategoryByPath} from "@/features/categories/categoryTree"
import {type CategoryWithSubCategoriesType} from "@/features/categories/CategoryType"
import {API_BASE_URL} from "@/utils/apiConfig"

async function getCategories(): Promise<CategoryWithSubCategoriesType[]> {
    const res = await fetch(`${API_BASE_URL}/product/categories/with-subcategories`, {
        next: {revalidate: 60}
    })

    if (!res.ok) {
        throw new Error("Failed to load categories")
    }

    return (await res.json()) as CategoryWithSubCategoriesType[]
}

interface PageProps {
    params: {
        category: string[]
    }
}

const CategoryPage = async ({params}: PageProps) => {
    const categories = await getCategories()
    const tree = buildCategoryTree(categories)
    const path = params.category.join("/")
    const currentCategory = findCategoryByPath(tree, path)

    if (!currentCategory) notFound()

    return (
        <main className={styles.page}>
            <h1 className={styles.title}>{currentCategory.title}</h1>
            <div className={styles.subtitle}>Подкатегории</div>
            {currentCategory.sub_categories.length > 0 ? (
                <div className={styles.list}>
                    {currentCategory.sub_categories.map(subCategory => (
                        <Link key={subCategory.id} href={subCategory.path} className={styles.link}>
                            {subCategory.title}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>Подкатегории отсутствуют.</div>
            )}
        </main>
    )
}

export default CategoryPage
