import React, {useEffect, useState} from "react"
import styled from "./ImageBlock.module.css"
import NextImage from "next/image"
// import LoadingOutlined from "@ant-design/icons/LoadingOutlined"
// import WarningOutlined from "@ant-design/icons/WarningOutlined"

interface ImageBlockProps {
    src: string
    alt: string
    priority?: boolean
    fill?: boolean
    width?: number
    height?: number
    quality?: number
}

const ImageBlock: React.FC<ImageBlockProps> = (
    {
        src,
        alt,
        priority,
        width,
        height,
        fill = false,
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
                            priority={priority}
                            width={width}
                            height={height}
                            fill={fill}
                            style={{objectFit: "cover"}}
                            sizes="(max-width: 768px) 100%"
                            quality={quality}
                        />
                    </div>
                })()
            }
        </div>
    )
}

export default ImageBlock
