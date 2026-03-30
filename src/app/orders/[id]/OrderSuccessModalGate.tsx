"use client"

import React from "react"
import {useRouter, useSearchParams} from "next/navigation"
import OrderSuccessModal from "@/features/checkout/order-success-modal/OrderSuccessModal"

interface OrderSuccessModalGateProps {
    orderId: number
}

const OrderSuccessModalGate: React.FC<OrderSuccessModalGateProps> = ({orderId}) => {
    const params = useSearchParams()
    const router = useRouter()
    const isOpen = params.get("success") === "1"

    if (!isOpen) return null

    return (
        <OrderSuccessModal
            isOpen={isOpen}
            orderId={orderId}
            hideOrderLink
            onClose={() => {
                router.replace(`/orders/${orderId}`, {scroll: false})
            }}
        />
    )
}

export default OrderSuccessModalGate
