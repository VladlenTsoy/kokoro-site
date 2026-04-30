import {API_BASE_URL} from "@/utils/apiConfig"
import {
    AuthResponse,
    Client,
    LogoutResponse,
    RefreshRequest,
    SendPhoneCodeRequest,
    SendPhoneCodeResponse,
    VerifyPhoneCodeRequest
} from "@/features/auth/authTypes"

const parseErrorMessage = async (response: Response, fallback: string) => {
    try {
        const data = await response.json()
        if (typeof data?.message === "string" && data.message.trim()) {
            return data.message
        }
    } catch {
        // keep fallback
    }

    return fallback
}

const requestJson = async <TResponse, TBody = unknown>(
    path: string,
    options: {
        method?: "GET" | "POST"
        body?: TBody
        accessToken?: string
    } = {}
): Promise<TResponse> => {
    const headers: HeadersInit = {
        "Content-Type": "application/json"
    }

    if (options.accessToken) {
        headers.Authorization = `Bearer ${options.accessToken}`
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method ?? "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
    })

    if (!response.ok) {
        const message = await parseErrorMessage(response, `Ошибка запроса. Код: ${response.status}`)
        throw new Error(`${response.status}: ${message}`)
    }

    return response.json() as Promise<TResponse>
}

export const sendPhoneCode = (body: SendPhoneCodeRequest) =>
    requestJson<SendPhoneCodeResponse, SendPhoneCodeRequest>("/client/auth/phone/send-code", {
        method: "POST",
        body
    })

export const verifyPhoneCode = (body: VerifyPhoneCodeRequest) =>
    requestJson<AuthResponse, VerifyPhoneCodeRequest>("/client/auth/phone/verify", {
        method: "POST",
        body
    })

export const getCurrentClient = (accessToken: string) =>
    requestJson<Client>("/client/profile", {
        accessToken
    })

export const refreshAuthTokens = (body: RefreshRequest) =>
    requestJson<AuthResponse, RefreshRequest>("/client/auth/refresh", {
        method: "POST",
        body
    })

export const logoutClient = (refreshToken: string) =>
    requestJson<LogoutResponse, {refreshToken: string}>("/client/auth/logout", {
        method: "POST",
        body: {refreshToken}
    })
