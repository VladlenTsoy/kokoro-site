"use client"

import React, {Suspense, lazy} from "react"
import styles from "./ImageGallery.module.css"
import Image from "next/image"
import cn from "classnames"
import {useScreenSize} from "@/hooks/useScreenSize"
import LoadingBlock from "@/components/loading-block/LoadingBlock"

const CarouselImages = lazy(() => import("@/components/carousel-images/CarouselImages"))


interface ImageGalleryProps {
    images: {
        id: number
        url: string
    }[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({images}) => {
    const {width} = useScreenSize()

    return (
        <>
            <Suspense fallback={<LoadingBlock />}>
                {
                    width <= 992 ?
                        <CarouselImages images={images} /> :
                        <div className={styles.container}>
                            {images.map((image, key) =>
                                <div className={cn(styles.image, {[styles.active]: key === 0})} key={key}>
                                    <Image src={image.url} alt={`image-${key}`} fill priority={key === 0} />
                                </div>
                            )}
                        </div>
                }
            </Suspense>
        </>
    )
}

export default ImageGallery
