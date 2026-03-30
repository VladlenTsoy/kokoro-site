const normalizeEnvValue = (value?: string) => value?.replace(/^=+/, "").replace(/\/+$/, "")

const rawAppPort = normalizeEnvValue(process.env.NEXT_PUBLIC_APP_PORT)
const rawSiteUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SITE_URL)
const rawApiBaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_API_BASE_URL)

export const APP_PORT = rawAppPort || "3000"
export const SITE_URL = rawSiteUrl || `http://localhost:${APP_PORT}`
export const API_BASE_URL = rawApiBaseUrl
    ? (rawApiBaseUrl.startsWith("http") ? rawApiBaseUrl : `${SITE_URL}/${rawApiBaseUrl.replace(/^\/+/, "")}`)
    : `${SITE_URL}/api`
