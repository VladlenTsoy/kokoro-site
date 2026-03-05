import React from "react"
import type {Metadata} from "next"
import AboutUsContent from "@/app/about-us/AboutUsContent"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
    title: "О нас | KOKORO",
    description: "О бренде KOKORO: философия, стиль и вдохновение японской эстетикой и урбан-культурой.",
    alternates: {
        canonical: `${SITE_URL}/about-us`
    },
    openGraph: {
        title: "О нас | KOKORO",
        description: "О бренде KOKORO: философия, стиль и вдохновение японской эстетикой и урбан-культурой.",
        url: `${SITE_URL}/about-us`,
        type: "website"
    },
    twitter: {
        card: "summary",
        title: "О нас | KOKORO",
        description: "О бренде KOKORO: философия, стиль и вдохновение японской эстетикой и урбан-культурой."
    }
}

const Page = () => {
    return <AboutUsContent />
}

export default Page
