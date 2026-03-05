import React from "react"
import {formatPrice} from "@/utils/formatPrice"
import {useSelector} from "react-redux"
import {selectCartCount, selectCartItems, selectCartLastAddedItemId, selectCartTotal} from "@/features/cart/cartSlice"
import styles from "./CartPopoverContent.module.css"
import Button from "@/components/button/Button"
import ArrowRightIcon from "@/components/icons/ArrowRightIcon"
import CloseIcon from "@/components/icons/CloseIcon"
import {useRouter} from "next/navigation"
import Image from "next/image"
import Tag from "@/components/tag/Tag"
import {calculateDiscountedTotal} from "@/utils/calculateDiscountedTotal"

interface Props {
    onClose: () => void
}

const CartPopoverContent: React.FC<Props> = ({onClose}) => {
    const total = useSelector(selectCartTotal)
    const count = useSelector(selectCartCount)
    const items = useSelector(selectCartItems)
    const lastAddedItemId = useSelector(selectCartLastAddedItemId)
    const router = useRouter()
    const previewItem = items.find(item => item.id === lastAddedItemId) || items[items.length - 1]
    const previewHasDiscount = !!previewItem && typeof previewItem.discountPercent === "number" && previewItem.discountPercent > 0
    const previewUnitPrice = previewItem?.price ?? 0
    const previewDiscountedUnitPrice = previewHasDiscount
        ? calculateDiscountedTotal(previewUnitPrice, previewItem.discountPercent)
        : previewUnitPrice

    const onClickHandler = () => {
        router.push(`/cart`)
        onClose()
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.close_icon} onClick={onClose}>
                    <CloseIcon />
                </div>
                <div className={styles.popover_title}>Корзина</div>
                {previewItem && (
                    <div className={styles.preview}>
                        <div className={styles.preview_image}>
                            <Image
                                src={previewItem.image || "/images/t-shirt.png"}
                                alt={previewItem.title}
                                fill
                                sizes="160px"
                            />
                        </div>
                        <div className={styles.preview_title}>{previewItem.title}</div>
                        <div className={styles.preview_tags}>
                            {previewItem.sizeTitle && <Tag>{previewItem.sizeTitle}</Tag>}
                            {previewItem.colorTitle && <Tag>{previewItem.colorTitle}</Tag>}
                        </div>
                        {previewHasDiscount && (
                            <div className={styles.preview_old_price}>{formatPrice(previewUnitPrice)}сум</div>
                        )}
                        <div className={styles.preview_price}>
                            {formatPrice(previewDiscountedUnitPrice)}сум
                        </div>
                    </div>
                )}
                {!previewItem && (
                    <div className={styles.empty}>Корзина пуста</div>
                )}
            </div>
            <div className={styles.footer}>
                <div className={styles.popover_footer_row}>
                    <div>Всего <span className={styles.secondary}>(товаров {count})</span>:</div>
                    <div className={styles.total_price}><span>{formatPrice(total)}</span> сум</div>
                </div>
                <Button block onClick={onClickHandler}>
                    К оформлению
                    <ArrowRightIcon />
                </Button>
            </div>
        </div>
    )
}

export default CartPopoverContent
