"use client"

import {useEffect, useState} from "react"

export const useScreenSize = () => {
    const [width, setWidth] = useState(0)
    const [md, setMd] = useState(false)

    const resizeHandler = (e: any) => {
        const newWidth = e ? e.currentTarget.innerWidth : window.innerWidth
        setWidth(newWidth)
        setMd(newWidth < 1200)
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", resizeHandler)
            // Устанавливаем начальное значение ширины
            resizeHandler(null)

            return () => {
                window.removeEventListener("resize", resizeHandler)
            }
        }
    }, [])

    return {width, md}
}
