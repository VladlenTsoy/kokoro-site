"use client"

import React from "react"
import styled from "./ImageBlock.module.css"
import NextImage from "next/image"

type ImageBlockBaseProps = {
    src: string
    alt: string
    priority?: boolean
    quality?: number
    blurDataURL?: string
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
        quality = 100,
        blurDataURL
    }
) => {
    if (!src) {
        return (
            <div className={styled.imageBlock}>
                <div className={styled.loading}>ERROR</div>
            </div>
        )
    }

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
                    placeholder="blur"
                    blurDataURL={blurDataURL || "data:image/gif;base64,R0lGODlhAQABAPAAAN7e3gAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="}
                />
            </div>
        </div>
    )
}

export default ImageBlock
