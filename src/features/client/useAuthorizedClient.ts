"use client"

import {useDispatch, useSelector} from "react-redux"
import {
    clearAuth,
    selectAccessToken,
    selectClient,
    selectRefreshToken,
    setAuth,
    setClient
} from "@/features/auth/authSlice"
import {AuthResponse, Client} from "@/features/auth/authTypes"
import {useCallback} from "react"

export const useAuthorizedClient = () => {
    const dispatch = useDispatch()
    const accessToken = useSelector(selectAccessToken)
    const refreshToken = useSelector(selectRefreshToken)
    const client = useSelector(selectClient)

    const onRefresh = useCallback((response: AuthResponse) => {
        dispatch(setAuth(response))
    }, [dispatch])

    const onClient = useCallback((nextClient: Client) => {
        dispatch(setClient(nextClient))
    }, [dispatch])

    const logoutLocal = useCallback(() => {
        dispatch(clearAuth())
    }, [dispatch])

    return {
        accessToken,
        refreshToken,
        client,
        onRefresh,
        onClient,
        logoutLocal
    }
}
