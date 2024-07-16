"use client"

import {useEffect, useState} from "react"

export const useScreenSize = () => {
    const [width, setWidth] = useState(0)
    const [md, setMd] = useState(false)

    const resizeHandler = (e: any) => {
        setWidth(e.currentTarget.innerWidth)
        setMd(e.currentTarget.innerWidth < 1200)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", resizeHandler)

            return () => {
                window.removeEventListener("resize", resizeHandler)
            }
        }
    }, [])

    return {width, md}
}
