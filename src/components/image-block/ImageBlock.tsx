"use client"

import React, {useEffect, useState} from "react"
import styled from "./ImageBlock.module.css"
import NextImage from "next/image"

type ImageBlockBaseProps = {
    src: string
    alt: string
    priority?: boolean
    quality?: number
}

type ImageBlockFillProps = ImageBlockBaseProps & {
    fill: true
    width?: never
    height?: never
}

type ImageBlockSizedProps = ImageBlockBaseProps & {
    fill?: false
    width: number
    height: number
}

type ImageBlockProps = ImageBlockFillProps | ImageBlockSizedProps

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
        setLoading(true)
        setError(false)
    }, [src])

    return (
        <div className={styled.imageBlock}>
            <div className={styled.image}>
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
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setError(true)
                        setLoading(false)
                    }}
                />
            </div>
            {loading && (
                <div className={styled.loading}>
                    Loading...
                </div>
            )}
            {error && (
                <div className={styled.loading}>
                    ERROR
                </div>
            )}
        </div>
    )
}

export default ImageBlock
