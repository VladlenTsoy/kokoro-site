import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {AuthResponse, Client} from "@/features/auth/authTypes"

interface AuthState {
    accessToken: string | null
    tokenType: "Bearer" | null
    expiresInMinutes: number | null
    refreshToken: string | null
    refreshTokenExpiresInDays: number | null
    client: Client | null
}

const initialState: AuthState = {
    accessToken: null,
    tokenType: null,
    expiresInMinutes: null,
    refreshToken: null,
    refreshTokenExpiresInDays: null,
    client: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthResponse>) => {
            state.accessToken = action.payload.accessToken
            state.tokenType = action.payload.tokenType
            state.expiresInMinutes = action.payload.expiresInMinutes
            state.refreshToken = action.payload.refreshToken
            state.refreshTokenExpiresInDays = action.payload.refreshTokenExpiresInDays
            state.client = action.payload.client
        },
        setClient: (state, action: PayloadAction<Client>) => {
            state.client = action.payload
        },
        clearAuth: state => {
            state.accessToken = null
            state.tokenType = null
            state.expiresInMinutes = null
            state.refreshToken = null
            state.refreshTokenExpiresInDays = null
            state.client = null
        }
    }
})

export const {setAuth, setClient, clearAuth} = authSlice.actions
export const authReducer = authSlice.reducer

export const selectAccessToken = (state: {auth: AuthState}) => state.auth.accessToken
export const selectRefreshToken = (state: {auth: AuthState}) => state.auth.refreshToken
export const selectClient = (state: {auth: AuthState}) => state.auth.client
export const selectIsAuthenticated = (state: {auth: AuthState}) => Boolean(state.auth.accessToken && state.auth.client)
