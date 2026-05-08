import getTextValue from "@/utils/getTextValue"
import type {
    ProductVariant,
    ProductVariantImage,
    ProductVariantMeasurement,
    ProductVariantSize
} from "@/features/product-variants/productVariantsApi"

export interface SelectOption {
    color?: string
    title: string
    value: string | number
    disabled?: boolean
    hint?: string
    availableQty?: number
}

export const mapImages = (images: ProductVariantImage[] | undefined) =>
    images?.length
        ? images.map(image => ({
            id: image.id,
            url: image.path
        }))
        : []

export const getAvailableQty = (item: ProductVariantSize) =>
    Math.max(Number(item.qty || 0) - Number(item.reservedQty || 0), 0)

export const mapSizeOptions = (sizes: ProductVariantSize[] | undefined): SelectOption[] =>
    sizes?.length
        ? sizes.map(item => {
            const availableQty = getAvailableQty(item)

            return {
                title: availableQty > 0 ? getTextValue(item.size.title) : `${getTextValue(item.size.title)} — нет в наличии`,
                value: item.size.id,
                disabled: availableQty <= 0,
                hint: availableQty > 0 ? `Доступно: ${availableQty}` : "Нет в наличии",
                availableQty
            }
        })
        : []

export const mapColorOptions = (product: ProductVariant): SelectOption[] =>
    product.color
        ? [
            {
                color: product.color.hex,
                title: getTextValue(product.color.title),
                value: product.id
            },
            ...(product.related_variants ?? []).map(variant => ({
                color: variant.color.hex,
                title: getTextValue(variant.color.title),
                value: variant.id
            }))
        ]
        : []

export const buildSizeTitleMap = (sizes: ProductVariantSize[] | undefined) =>
    new Map<number, string>(
        sizes?.map(item => [item.size.id, getTextValue(item.size.title)]) ?? []
    )

export const buildMeasurementColumns = (
    measurements: ProductVariantMeasurement[] | undefined,
    sizeTitleById: Map<number, string>
) => {
    const measurementSizeIds = new Set<number>()

    measurements?.forEach(item => {
        Object.keys(item.descriptions || {}).forEach(key => {
            const id = Number(key)
            if (!Number.isNaN(id)) measurementSizeIds.add(id)
        })
    })

    return Array.from(measurementSizeIds)
        .sort((a, b) => a - b)
        .map(id => ({
            id,
            title: sizeTitleById.get(id) || String(id)
        }))
}
