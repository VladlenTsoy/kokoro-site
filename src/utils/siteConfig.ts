export const APP_PORT = process.env.NEXT_PUBLIC_APP_PORT || "3000"
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${APP_PORT}`
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || `${SITE_URL}/api`
