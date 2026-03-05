"use client"

import React, {lazy, Suspense} from "react"
import styles from "./ImageGallery.module.css"
import Image from "next/image"
import cn from "classnames"
import LoadingBlock from "@/components/loading-block/LoadingBlock"
import {useMediaQuery} from "react-responsive"

const CarouselImages = lazy(() => import("@/components/carousel-images/CarouselImages"))


interface ImageGalleryProps {
    images: {
        id: number
        url: string
    }[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({images}) => {
    const isMobile = useMediaQuery({query: "(max-width: 992px)"})

    return (
        <>
            <Suspense fallback={<LoadingBlock />}>
                {
                    isMobile ?
                        <CarouselImages images={images} /> :
                        <div className={styles.container}>
                            {images.map((image, key) =>
                                <div className={cn(styles.image, {[styles.active]: key === 0})} key={key}>
                                    <Image
                                        src={image.url}
                                        alt={`image-${key}`}
                                        fill
                                        priority={key === 0}
                                        sizes="(max-width: 992px) 100vw, (max-width: 1200px) calc(100vw - 430px), (max-width: 1400px) calc(100vw - 530px), calc(100vw - 580px)"
                                    />
                                </div>
                            )}
                        </div>
                }
            </Suspense>
        </>
    )
}

export default ImageGallery
