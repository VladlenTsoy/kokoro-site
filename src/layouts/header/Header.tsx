import React from "react"
import styles from "./Header.module.css"
import Link from "next/link"
import HeaderMenu from "@/layouts/header/HeaderMenu"
import HeaderSubMenu from "@/layouts/header/HeaderSubMenu"
import Logo from "@/components/logo/Logo"
import type {ProductVariant} from "@/features/product-variants/productVariantsApi"
import {notFound} from "next/navigation"
import {API_BASE_URL} from "@/utils/apiConfig"
import {CategoryWithSubCategoriesType} from "@/features/categories/CategoryType"

async function getCategoryListWithSubCategories(): Promise<CategoryWithSubCategoriesType[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/product/categories/with-subcategories`, {
            next: {revalidate: 10}
        })

        if (!res.ok) return []

        const data = (await res.json()) as CategoryWithSubCategoriesType[]
        if (!data) return []

        return data
    } catch {
        return []
    }
}

const Header: React.FC = async () => {
    const categories = await getCategoryListWithSubCategories()

    return (
        <div className={styles.header}>
            <HeaderMenu categories={categories} />
            <div className={styles.logo_block}>
                <Link href="/">
                    <Logo height={24} width={125} />
                </Link>
            </div>
            <HeaderSubMenu />
        </div>
    )
}

export default Header
