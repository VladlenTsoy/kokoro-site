"use client"

import React from "react"
import styles from "./ImageGallery.module.css"
import Image from "next/image"
import cn from "classnames"

interface ImageGalleryProps {
    images: string[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({images}) => {

    return (
        <div className={styles.container}>
            {images.map((image, key) =>
                <div className={cn(styles.image, {[styles.active]: key === 0})} key={key}>
                    <Image src={image} alt={`image-${key}`} fill priority={key === 0} />
                </div>
            )}
        </div>
    )
}

export default ImageGallery
