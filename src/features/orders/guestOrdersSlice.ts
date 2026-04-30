import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface GuestOrderAccess {
    orderId: number
    orderAccessToken: string
}

interface GuestOrdersState {
    items: GuestOrderAccess[]
}

const initialState: GuestOrdersState = {
    items: []
}

const guestOrdersSlice = createSlice({
    name: "guestOrders",
    initialState,
    reducers: {
        saveGuestOrderAccess: (state, action: PayloadAction<GuestOrderAccess>) => {
            state.items = state.items.filter(item => item.orderId !== action.payload.orderId)
            state.items.unshift(action.payload)
        }
    }
})

export const {saveGuestOrderAccess} = guestOrdersSlice.actions
export const guestOrdersReducer = guestOrdersSlice.reducer

export const selectGuestOrderAccessToken = (orderId: number) => (state: {guestOrders: GuestOrdersState}) =>
    state.guestOrders.items.find(item => item.orderId === orderId)?.orderAccessToken ?? null
