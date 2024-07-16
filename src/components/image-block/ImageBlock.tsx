import React, {useEffect, useState} from "react"
import styled from "./ImageBlock.module.css"
import NextImage from "next/image"
// import LoadingOutlined from "@ant-design/icons/LoadingOutlined"
// import WarningOutlined from "@ant-design/icons/WarningOutlined"

interface ImageBlockProps {
    src: string
    alt: string
    priority?: boolean
    width?: number
    height?: number
    layout?: "fill" | "fixed" | "intrinsic" | "responsive"
    quality?: number
}

const ImageBlock: React.FC<ImageBlockProps> = (
    {
        src,
        alt,
        priority,
        width,
        height,
        layout = "fill",
        quality = 100
    }
) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const image = new Image()
        image.src = src
        setLoading(!image.complete)
        image.onload = () => {
            setLoading(false)
        }
        image.onerror = () => {
            setError(true)
        }

        return () => {
            image.onload = null
            image.onerror = null
        }
    }, [src])

    return (
        <div className={styled.imageBlock}>
            {
                (() => {

                    if (error)
                        return <div className={styled.loading}>
                            ERROR
                        </div>

                    if (loading)
                        return <div className={styled.loading}>
                            Loading...
                        </div>

                    return <div className={styled.image}>
                        <NextImage
                            src={src}
                            alt={alt}
                            layout={layout}
                            priority={priority}
                            width={width}
                            height={height}
                            objectFit="cover"
                            quality={quality}
                        />
                    </div>
                })()
            }
        </div>
    )
}

export default ImageBlock
