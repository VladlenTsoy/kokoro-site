import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export interface CartItem {
    id: string
    productVariantId: number
    sizeId: number | null
    qty: number
    price: number
    title: string
    image: string
    sizeTitle?: string
    colorTitle?: string
}

interface CartState {
    items: CartItem[]
}

const initialState: CartState = {
    items: []
}

const buildCartItemId = (productVariantId: number, sizeId: number | null) =>
    `${productVariantId}-${sizeId ?? "na"}`

interface AddItemPayload {
    productVariantId: number
    sizeId: number | null
    qty?: number
    price: number
    title: string
    image: string
    sizeTitle?: string
    colorTitle?: string
}

interface UpdateQtyPayload {
    id: string
    qty: number
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<AddItemPayload>) => {
            const {
                productVariantId,
                sizeId,
                qty = 1,
                price,
                title,
                image,
                sizeTitle,
                colorTitle
            } = action.payload
            const id = buildCartItemId(productVariantId, sizeId)
            const existing = state.items.find(item => item.id === id)

            if (existing) {
                existing.qty += qty
                return
            }

            state.items.push({
                id,
                productVariantId,
                sizeId,
                qty,
                price,
                title,
                image,
                sizeTitle,
                colorTitle
            })
        },
        updateQty: (state, action: PayloadAction<UpdateQtyPayload>) => {
            const item = state.items.find(entry => entry.id === action.payload.id)
            if (!item) return

            item.qty = action.payload.qty
            if (item.qty <= 0) {
                state.items = state.items.filter(entry => entry.id !== action.payload.id)
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload)
        },
        clearCart: state => {
            state.items = []
        }
    }
})

export const {addItem, updateQty, removeItem, clearCart} = cartSlice.actions
export const cartReducer = cartSlice.reducer

export const selectCartItems = (state: {cart: CartState}) => state.cart.items
export const selectCartTotal = (state: {cart: CartState}) =>
    state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
export const selectCartCount = (state: {cart: CartState}) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0)
