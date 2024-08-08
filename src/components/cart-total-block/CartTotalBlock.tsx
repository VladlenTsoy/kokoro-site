import React from "react"
import styles from "./CartTotalBlock.module.css"
import Button from "@/components/button/Button"
import {formatPrice} from "@/utils/formatPrice"
import Input from "@/components/input/Input"

interface CartTotalBlockProps {

}

const CartTotalBlock = () => {
    return (
        <div className={styles.container}>
            <h5 className={styles.title}>Ваша корзина:</h5>
            <div className={styles.product_list}>
                <div className={styles.product_item}>
                    <div className={styles.label}>Tanjiro Demon Slayer:</div>
                    <div className={styles.price}>
                        <span>1</span>
                        <span>x</span>
                        {formatPrice(350000)}cум
                    </div>
                </div>
                <div className={styles.product_item}>
                    <div className={styles.label}>Tanjiro Demon Slayer:</div>
                    <div className={styles.price}>
                        <span>1</span>
                        <span>x</span>
                        {formatPrice(350000)}cум
                    </div>
                </div>
                <div className={styles.product_item}>
                    <div className={styles.label}>Tanjiro Demon Slayer:</div>
                    <div className={styles.price}>
                        <span>1</span>
                        <span>x</span>
                        {formatPrice(350000)}cум
                    </div>
                </div>
            </div>
            <div className={styles.promo_code}>
                <Input placeholder="Введите промокод..." style={{paddingLeft: 0, paddingRight: 0}} />
            </div>
            <div className={styles.total}>
                <div className={styles.label}>Всего:</div>
                <div className={styles.value}>2.850.000сум</div>
            </div>
            <Button block>
                К оформлению
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7.90674L28.0933 16.0001L20 24.0934" stroke="white" strokeWidth="2"
                          strokeMiterlimit="10" strokeLinecap="square" strokeLinejoin="round" />
                    <path d="M4.66406 16H27.1041" stroke="white" strokeWidth="2" strokeMiterlimit="10"
                          strokeLinecap="square" strokeLinejoin="round" />
                </svg>
            </Button>
        </div>
    )
}

export default CartTotalBlock
