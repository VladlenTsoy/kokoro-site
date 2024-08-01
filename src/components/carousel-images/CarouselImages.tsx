import React from "react"
import styles from "@/components/image-gallery/ImageGallery.module.css"
import {CarouselProvider, Dot, Slide, Slider} from "pure-react-carousel"
import ImageBlock from "@/components/image-block/ImageBlock"

interface CarouselImagesProps {
    images: {
        id: number
        url: string
    }[]
}

const CarouselImages:React.FC<CarouselImagesProps> = ({images}) => {
    return <div className={styles.sliders}>
        <CarouselProvider
            naturalSlideHeight={1280}
            naturalSlideWidth={960}
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
                                <ImageBlock src={image.url} alt={`image-${image.id}`} fill priority={key === 0} />
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
}

export default CarouselImages
