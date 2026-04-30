export interface Client {
    id: number
    name: string
    phone: string | null
    bonusBalance: number
    isActive: boolean
    createdAt: string
    lastLoginAt: string | null
}

export interface SendPhoneCodeRequest {
    phoneNumber: string
}

export interface SendPhoneCodeResponse {
    requestId: string
    phoneNumber: string
    expiresInSeconds: number
}

export interface VerifyPhoneCodeRequest {
    phoneNumber: string
    requestId: string
    code: string
    name?: string
}

export interface AuthResponse {
    accessToken: string
    tokenType: "Bearer"
    expiresInMinutes: number
    refreshToken: string
    refreshTokenExpiresInDays: number
    client: Client
}

export interface RefreshRequest {
    refreshToken: string
}

export interface LogoutRequest {
    refreshToken: string
}

export interface LogoutResponse {
    message: "Logged out"
}
