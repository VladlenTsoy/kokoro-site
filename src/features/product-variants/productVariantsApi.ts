import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export interface ProductVariantColor {
    id: number
    title: string
    hex: string
    deleted_at: string | null
}

export interface ProductVariantProduct {
    id: number
    category_id: number
    created_at: string
    properties: {
        id: number
        title: string
        description: string
    }[]
}

export interface ProductVariantStatus {
    id: number
    title: string
    position: number
    is_default: boolean
}

export interface ProductVariantSize {
    id: number
    cost_price: number
    qty: number
    min_qty: number
    productVariant: string
    size: {
        id: number
        title: string
        deleted_at: string | null
    }
}

export interface ProductVariantImage {
    id: number
    product_variant_id: number
    name: string
    path: string
    size: number
    position: number
    productVariant: string
}

export interface ProductVariantMeasurement {
    id: number
    title: string
    descriptions: Record<string, string>
    productVariant: string
}

export interface ProductVariant {
    id: number
    title: string
    price: number
    product_id: number
    storage_id: number
    status_id: number
    color_id: number
    is_new: boolean
    created_at: string
    color: ProductVariantColor
    product: ProductVariantProduct
    status: ProductVariantStatus
    sizes: ProductVariantSize[]
    images: ProductVariantImage[]
    discount?: {
        discountPercent?: string
        endDate?: string
    }
    measurements: ProductVariantMeasurement[]
    related_variants: {
        id: number
        title: string
        color: ProductVariantColor
    }[]
}

export type ProductVariantsResponse =
    | ProductVariant[]
    | {
    items: ProductVariant[]
    total?: number
}

export interface ProductVariantsQueryParams {
    page?: number
    per_page?: number

    [key: string]: string | number | boolean | undefined
}

export const productVariantsApi = createApi({
    reducerPath: "productVariantsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api"
    }),
    tagTypes: ["ProductVariant"],
    endpoints: builder => ({
        getProductVariants: builder.query<ProductVariantsResponse, ProductVariantsQueryParams | void>({
            query: params => ({
                url: "product/variants",
                params: params ?? undefined
            }),
            providesTags: result => {
                if (!result) return ["ProductVariant"]

                const items = Array.isArray(result) ? result : result.items

                return [
                    ...items.map(item => ({type: "ProductVariant" as const, id: item.id})),
                    "ProductVariant"
                ]
            }
        }),
        getProductVariantById: builder.query<ProductVariant, number>({
            query: id => `product/variants/${id}`,
            providesTags: (_result, _error, id) => [{type: "ProductVariant", id}]
        })
    })
})

export const {useGetProductVariantsQuery, useGetProductVariantByIdQuery} = productVariantsApi
