import {useEffect, useState} from "react"

export const useScreenSize = () => {
    const [width, setWidth] = useState(window.innerWidth)
    const [md, setMd] = useState(window.innerWidth < 1200)

    const resizeHandler = (e: any) => {
        setWidth(e.currentTarget.innerWidth)
        setMd(e.currentTarget.innerWidth < 1200)
    }

    useEffect(() => {
        window.addEventListener("resize", resizeHandler)

        return () => {
            window.removeEventListener("resize", resizeHandler)
        }
    }, [])

    return {width, md}
}