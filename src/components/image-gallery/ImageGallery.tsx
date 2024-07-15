"use client"

import React from "react"
import styles from "./ImageGallery.module.css"
import Image from "next/image"
import cn from "classnames"
import {CarouselProvider, Slider, Slide, Dot} from "pure-react-carousel"
import {useScreenSize} from "@/hooks/useScreenSize"
import ImageBlock from "@/components/image-block/ImageBlock"

interface ImageGalleryProps {
    images: {
        id: number
        url: string
    }[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({images}) => {
    const {width} = useScreenSize()

    if (width <= 992)
        return <div className={styles.sliders}>
            <CarouselProvider
                naturalSlideHeight={326}
                naturalSlideWidth={326}
                totalSlides={images.length}
                visibleSlides={1}
                step={1}
                dragStep={1}
                infinite
            >
                <Slider>
                    {
                        images.map((image, key) =>
                            <Slide index={image.id} key={key}>
                                <div className={styles.slider}>
                                    <ImageBlock src={image.url} alt={`image-${image.id}`} priority={key === 0} />
                                </div>
                            </Slide>
                        )
                    }
                </Slider>
                <div className={styles.dots}>
                    {
                        images.map((img, key) =>
                            <Dot slide={key} className={styles.dot} key={key} />
                        )
                    }
                </div>
            </CarouselProvider>
        </div>

    return (
        <div className={styles.container}>
            {images.map((image, key) =>
                <div className={cn(styles.image, {[styles.active]: key === 0})} key={key}>
                    <Image src={image.url} alt={`image-${key}`} fill priority={key === 0} />
                </div>
            )}
        </div>
    )
}

export default ImageGallery
