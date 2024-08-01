import React from "react"
import styles from "./page.module.css"
import Breadcrumb from "@/components/breadcrumb/Breadcrumb"
import ImageGallery from "@/components/image-gallery/ImageGallery"
import Select from "@/components/select/Select"
import Tabs from "@/components/tabs/Tabs"
import Button from "@/components/button/Button"
import Container from "@/layouts/container/Container"
import ProductPrice from "@/components/product-price/ProductPrice"

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
    {
        label: "Параметры",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae, culpa debitis deserunt ducimus excepturi fuga, impedit labore maiores minima obcaecati pariatur quasi quo sit. Asperiores ea esse hic itaque labore?"
    },
    {label: "Состав и уход", content: "Content of Tab 2"}
]

const images = [
    {
        id: 1,
        url: "/images/1.jpg"
    },
    {
        id: 2,
        url: "/images/2.jpg"
    },
    {
        id: 3,
        url: "/images/3.jpg"
    }
]

const Page = ({params}: {params: {id: string}}) => {
    console.log(params)
    const {title, description, price, discount} = {
        title: "ФУТБОЛКА TANJIRO",
        description: "Добро пожаловать в мир Demon Slayer с нашей новой футболкой \"Tanjiro\" от KOKORO! Откройте\n" +
            "для себя мощь и решимость этого замечательного персонажа, который вдохновляет на настоящие\n" +
            "подвиги.",
        price: 350000,
        discount: 50
    }

    return (
        <Container>
            <Breadcrumb />
            <div className={styles.container}>
                <ImageGallery images={images} />
                <div className={styles.details}>
                    <div className={styles.sticky}>
                        <div className={styles.product_header}>
                            <h1 className={styles.title}>{title}</h1>
                            <ProductPrice price={price} discount={discount} />
                        </div>
                        <div className={styles.description}>
                            {description}
                        </div>
                        <div className={styles.options}>
                            <Select options={options} />
                            <Select options={sizeOptions} />
                        </div>
                        <div className={styles.tabs}>
                            <Tabs tabs={tabs} />
                        </div>
                        <div className={styles.actions}>
                            <Button block>Добавить в корзину</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Page

export const config = {
    revalidate: 10
}
