import React from "react"
import styles from "./page.module.css"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import ImageGallery from "@/components/image-gallery/ImageGallery"
import Select from "@/components/select/Select"
import Tabs from "@/components/tabs/Tabs"
import Button from "@/components/button/Button"

const options = [
    {
        title: "L",
        value: 3
    },
    {
        title: "oversize",
        value: 1
    },
    {
        title: "M",
        value: 2
    }
]

const sizeOptions = [
    {
        color: "blue",
        title: "Бело-синий",
        value: 3
    },
    {
        color: "black",
        title: "Черный",
        value: 1
    }
]

const tabs = [
    {label: "Параметры", content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae, culpa debitis deserunt ducimus excepturi fuga, impedit labore maiores minima obcaecati pariatur quasi quo sit. Asperiores ea esse hic itaque labore?"},
    {label: "Состав и уход", content: "Content of Tab 2"},
]

const Page = () => {
    return (
        <>
            <Breadcrumb />
            <div className={styles.container}>
                <ImageGallery
                    images={["/images/t-shirt.png", "/images/t-shirt.png", "/images/t-shirt.png", "/images/t-shirt.png", "/images/t-shirt.png"]} />
                <div className={styles.details}>
                    <div className={styles.sticky}>
                        <div className={styles.product_header}>
                            <h1 className={styles.title}>Tanjiro Demon Slayer</h1>
                            <div className={styles.prices}>
                                <div className={styles.discount}>
                                    <svg width="104" height="18" viewBox="0 0 104 18" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 17C19.1615 11.1536 64.9876 -0.210397 103 1.10505" stroke="#F04438"
                                              strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    1.500.000сум
                                </div>
                                <div className={styles.price}>1.350.000сум</div>
                            </div>
                        </div>
                        <div className={styles.description}>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam blanditiis cumque est
                            facere officia ullam unde! Commodi corporis, dolore, enim eos est, fuga hic illo incidunt
                            provident quasi vero!
                        </div>
                        <div className={styles.options}>
                            <Select options={options} />
                            <Select options={sizeOptions} />
                        </div>
                        <div>
                            <Tabs tabs={tabs} />
                            <Button block>Добавить в корзину</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page
