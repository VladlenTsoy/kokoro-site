"use client"

import React from "react"
import {useRouter} from "next/navigation"
import Select from "@/components/select/Select"

interface OptionProps {
    color?: string
    title: string
    value: string | number
}

interface ProductVariantSelectProps {
    options: OptionProps[]
}

const ProductVariantSelect: React.FC<ProductVariantSelectProps> = ({options}) => {
    const router = useRouter()

    const onChangeHandler = (option: OptionProps) => {
        router.push(`/product/${option.value}`)
    }

    if (options.length === 0) return null

    return <Select options={options} onChange={onChangeHandler} />
}

export default ProductVariantSelect
