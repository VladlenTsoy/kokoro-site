import {API_BASE_URL} from "@/utils/apiConfig"
import {AuthResponse, Client, RefreshRequest} from "@/features/auth/authTypes"

export interface ClientAddress {
    id: number
    address: string
    location: Record<string, unknown> | null
}

export interface OrderStatus {
    id: number
    title: string
    access?: string
    fixed?: boolean
    position?: number
}

export interface OrderHistory {
    id: number
    createdAt: string
    status?: OrderStatus | null
    deliveryStatus?: string
    paymentStatus?: string
    comment?: string | null
}

export interface OrderItem {
    id?: number
    qty: number
    price?: number
    discount?: number
    promotion?: boolean
    finalPrice?: number
    lineTotal?: number
    productVariantId?: number
    productVariant?: {
        id: number
        title: string
        image?: string
    }
    productTitle?: string
    image?: string
    size?: {
        id: number
        title: string
    } | null
    sizeTitle?: string | null
}

export interface OrderPaymentMethod {
    id: number
    title: string
    code?: string | null
    isOnline?: boolean
}

export interface OrderDeliveryType {
    id: number
    title: string
    type?: string
    price?: number
}

export interface Order {
    id: number
    orderNumber?: string
    total: number
    subtotal?: number
    discountTotal?: number
    deliveryPrice?: number
    promoCode?: string | null
    promoDiscount?: number
    bonusSpent?: number
    bonusEarned?: number
    paymentStatus?: "pending" | "paid" | "failed" | "refunded"
    deliveryStatus?: "pending" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled"
    paymentMethod?: OrderPaymentMethod | null
    deliveryType?: OrderDeliveryType | null
    accessToken?: string | null
    createdAt: string
    updatedAt?: string
    status?: OrderStatus
    client: {
        id?: number
        name: string
        phone: string | null
    }
    address: ClientAddress | null
    items: OrderItem[]
    histories?: OrderHistory[]
}

export interface OrdersListResponse {
    items: Order[]
    total: number
    page: number
    pageSize: number
}

export interface PaymeLinkResponse {
    paymentUrl: string
    merchantId: string
    amount: number
    orderId: number
    orderNumber: string
    account: {
        order_id: number
    }
}

export interface ReorderResponse {
    address: {
        address: string
        location: Record<string, unknown> | null
    } | null
    items: Array<{
        productVariantId: number
        qty: number
    }>
    comment?: string
    paymentMethodId?: number
    deliveryTypeId?: number
}

interface AuthorizedRequestOptions<TBody> {
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    body?: TBody
    accessToken?: string | null
    refreshToken?: string | null
    onRefresh?: (response: AuthResponse) => void
    query?: Record<string, string | number | undefined | null>
}

const parseError = async (response: Response) => {
    let message = `Ошибка запроса. Код: ${response.status}`
    try {
        const data = await response.json()
        if (typeof data?.message === "string" && data.message.trim()) {
            message = data.message
        }
    } catch {
        // keep fallback
    }
    return new Error(`${response.status}: ${message}`)
}

const buildUrl = (path: string, query?: Record<string, string | number | undefined | null>) => {
    const url = new URL(`${API_BASE_URL}${path}`)
    Object.entries(query ?? {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).length > 0) {
            url.searchParams.set(key, String(value))
        }
    })
    return url.toString()
}

const refreshAuth = async (refreshToken: string) => {
    const response = await fetch(`${API_BASE_URL}/client/auth/refresh`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({refreshToken} satisfies RefreshRequest)
    })

    if (!response.ok) {
        throw await parseError(response)
    }

    return response.json() as Promise<AuthResponse>
}

export const requestWithAuth = async <TResponse, TBody = unknown>(
    path: string,
    options: AuthorizedRequestOptions<TBody> = {}
): Promise<TResponse> => {
    const run = async (token?: string | null) => fetch(buildUrl(path, options.query), {
        method: options.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? {Authorization: `Bearer ${token}`} : {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    })

    let response = await run(options.accessToken)

    if (response.status === 401 && options.refreshToken) {
        const refreshed = await refreshAuth(options.refreshToken)
        options.onRefresh?.(refreshed)
        response = await run(refreshed.accessToken)
    }

    if (!response.ok) {
        throw await parseError(response)
    }

    if (response.status === 204) {
        return {} as TResponse
    }

    return response.json() as Promise<TResponse>
}

export const getClientProfile = (accessToken: string, refreshToken: string | null, onRefresh: (response: AuthResponse) => void) =>
    requestWithAuth<Client>("/client/profile", {accessToken, refreshToken, onRefresh})

export const updateClientProfile = (
    body: {name?: string},
    accessToken: string,
    refreshToken: string | null,
    onRefresh: (response: AuthResponse) => void
) => requestWithAuth<Client, {name?: string}>("/client/profile", {
    method: "PATCH",
    body,
    accessToken,
    refreshToken,
    onRefresh
})

export const getClientAddresses = (accessToken: string, refreshToken: string | null, onRefresh: (response: AuthResponse) => void) =>
    requestWithAuth<ClientAddress[]>("/client/addresses", {accessToken, refreshToken, onRefresh})

export const createClientAddress = (
    body: {address: string; location?: Record<string, unknown>},
    accessToken: string,
    refreshToken: string | null,
    onRefresh: (response: AuthResponse) => void
) => requestWithAuth<ClientAddress, {address: string; location?: Record<string, unknown>}>("/client/addresses", {
    method: "POST",
    body,
    accessToken,
    refreshToken,
    onRefresh
})

export const updateClientAddress = (
    id: number,
    body: {address: string; location?: Record<string, unknown>},
    accessToken: string,
    refreshToken: string | null,
    onRefresh: (response: AuthResponse) => void
) => requestWithAuth<ClientAddress, {address: string; location?: Record<string, unknown>}>(`/client/addresses/${id}`, {
    method: "PATCH",
    body,
    accessToken,
    refreshToken,
    onRefresh
})

export const deleteClientAddress = (
    id: number,
    accessToken: string,
    refreshToken: string | null,
    onRefresh: (response: AuthResponse) => void
) => requestWithAuth<{message?: string}>(`/client/addresses/${id}`, {
    method: "DELETE",
    accessToken,
    refreshToken,
    onRefresh
})

export const getClientOrders = (
    page: number,
    pageSize: number,
    accessToken: string,
    refreshToken: string | null,
    onRefresh: (response: AuthResponse) => void
) => requestWithAuth<OrdersListResponse>("/client/orders", {
    accessToken,
    refreshToken,
    onRefresh,
    query: {page, pageSize}
})

export const getOrder = (
    id: number,
    options: {
        accessToken?: string | null
        refreshToken?: string | null
        orderAccessToken?: string | null
        onRefresh?: (response: AuthResponse) => void
    }
) => requestWithAuth<Order>(`/client/orders/${id}`, {
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    onRefresh: options.onRefresh,
    query: options.orderAccessToken ? {accessToken: options.orderAccessToken} : undefined
})

export const getPaymeLink = (
    id: number,
    options: {
        accessToken?: string | null
        refreshToken?: string | null
        orderAccessToken?: string | null
        lang?: string
        onRefresh?: (response: AuthResponse) => void
    }
) => requestWithAuth<PaymeLinkResponse>(`/client/orders/${id}/payme-link`, {
    method: "POST",
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    onRefresh: options.onRefresh,
    query: {
        ...(options.orderAccessToken ? {accessToken: options.orderAccessToken} : {}),
        lang: options.lang
    }
})

export const cancelOrder = (
    id: number,
    reason: string,
    options: {
        accessToken?: string | null
        refreshToken?: string | null
        orderAccessToken?: string | null
        onRefresh?: (response: AuthResponse) => void
    }
) => requestWithAuth<Order, {reason?: string}>(`/client/orders/${id}/cancel`, {
    method: "POST",
    body: reason.trim() ? {reason: reason.trim()} : {},
    accessToken: options.accessToken,
    refreshToken: options.refreshToken,
    onRefresh: options.onRefresh,
    query: options.orderAccessToken ? {accessToken: options.orderAccessToken} : undefined
})

export const reorderClientOrder = (
    id: number,
    accessToken: string,
    refreshToken: string | null,
    onRefresh: (response: AuthResponse) => void
) => requestWithAuth<ReorderResponse>(`/client/orders/${id}/reorder`, {
    method: "POST",
    accessToken,
    refreshToken,
    onRefresh
})
