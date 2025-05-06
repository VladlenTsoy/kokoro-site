"use client"

import React from "react"
import styles from "./page.module.css"
import Image from "next/image"
import {CarouselProvider, Dot, Slide, Slider} from "pure-react-carousel"
import {useMediaQuery} from "react-responsive"

const Page = () => {
    const isMobile = useMediaQuery({query: "(max-width: 768px)"})
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Image src="./images/logo_black.svg" alt="KOKORO logo" width={150} height={29} />
            </div>
            <div className={styles.container}>
                <h1>Соберите Все Карточки и Получите Приз!</h1>
                <div>
                    Мы создали для вас уникальную коллекцию из 7 карточек, которые вы можете получить, выполняя задания.
                    Одно из
                    таких заданий — покупка наших эксклюзивных футболок. С каждой футболкой вы получите одну карточку!
                </div>
            </div>
            <Image
                src="/images/LETTERHEAD.jpg"
                alt="kokoro cards"
                width={0}
                height={0}
                sizes="100vw"
                style={{width: "100%", height: "auto"}}
            />
            <div className={styles.container}>
                <h4>Как получить карточки:</h4>
                <ul>
                    <li><b>Покупка футболок:</b> Купите футболку и получите одну карточку.</li>
                    <li><b>Регистрация по телефону:</b> Карточки выдаются только при предоставлении номера телефона.
                    </li>
                </ul>
            </div>
            <div className={styles.container}>
                <h4>Правила получения карточек:</h4>
                <ul>
                    <li><b>Первая карточка</b> выдается случайным образом.</li>
                    <li><b>Следующие карточки</b> можно выбрать самостоятельно.</li>
                    <li><b>Всего необходимо собрать 7 разных карточек,</b> чтобы получить особый приз.</li>
                </ul>
            </div>
            <div className={styles.sliders}>
                <CarouselProvider
                    naturalSlideHeight={463}
                    naturalSlideWidth={326}
                    totalSlides={7}
                    visibleSlides={isMobile ? 1 : 3}
                    step={1}
                    dragStep={1}
                    infinite
                >
                    <Slider>
                        <Slide index={1} key={1}>
                            <div className={styles.slider} key={1}>
                                <Image
                                    src="/images/cards/itachi.png"
                                    alt="kokoro itachi card"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{width: "100%", height: "auto"}}
                                />
                            </div>
                        </Slide>
                        <Slide index={2} key={2}>
                            <div className={styles.slider}>
                                <Image
                                    src="/images/cards/nico.png"
                                    alt="kokoro nico card"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{width: "100%", height: "auto"}}
                                />
                            </div>
                        </Slide>
                        <Slide index={3} key={3}>
                            <div className={styles.slider}>
                                <Image
                                    src="/images/cards/nezuko.png"
                                    alt="kokoro nezuko card"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{width: "100%", height: "auto"}}
                                />
                            </div>
                        </Slide>
                        <Slide index={4} key={4}>
                            <div className={styles.slider}>
                                <Image
                                    src="/images/cards/tanjiro.png"
                                    alt="kokoro nezuko card"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{width: "100%", height: "auto"}}
                                />
                            </div>
                        </Slide>
                        <Slide index={5} key={5}>
                            <div className={styles.slider}>
                                <Image
                                    src="/images/cards/zenitsu.png"
                                    alt="kokoro tanjiro card"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{width: "100%", height: "auto"}}
                                />
                            </div>
                        </Slide>
                        <Slide index={6} key={6}>
                            <div className={styles.slider}>
                                <Image
                                    src="/images/cards/jiraiya.png"
                                    alt="kokoro jiraiya card"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{width: "100%", height: "auto"}}
                                />
                            </div>
                        </Slide>
                        <Slide index={7} key={7}>
                            <div className={styles.slider}>
                                <Image
                                    src="/images/cards/geto.png"
                                    alt="kokoro geto card"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{width: "100%", height: "auto"}}
                                />
                            </div>
                        </Slide>
                    </Slider>
                    <div className={styles.dots}>
                        <Dot slide={0} className={styles.dot} key={1} />
                        <Dot slide={1} className={styles.dot} key={2} />
                        <Dot slide={2} className={styles.dot} key={3} />
                        <Dot slide={3} className={styles.dot} key={4} />
                        <Dot slide={4} className={styles.dot} key={5} />
                        <Dot slide={5} className={styles.dot} key={6} />
                        <Dot slide={6} className={styles.dot} key={7} />
                    </div>
                </CarouselProvider>
            </div>
            <div className={styles.container}>
                <h4>Особый приз:</h4>
                Когда вы соберете все 7 карточек, вы получите эксклюзивную лимитированную футболку, которую нельзя будет
                купить!
            </div>
            <div className={styles.container}>
                <h4>Процесс получения особого приза:</h4>
                <ul>
                    <li><b>Свяжитесь с нами в Телеграме:</b> После сбора всех карточек, напишите нам.</li>
                    <li><b>Проверка подлинности карточек:</b> Отправьте нам коды, указанные на каждой карточке, для
                        проверки их подлинности и подтверждения уникальности.
                    </li>
                </ul>
                <b>Каждая карточка имеет уникальный номер, который привязан к вашему телефону.</b> После проверки всех 7
                карточек, вы получите свою лимитированную футболку!
            </div>
        </div>
    )
}

export default Page
