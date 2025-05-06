"use client"

import React, {useCallback, useState} from "react"
import MapBlock from "@/components/map-block/MapBlock"
import styles from "./CheckoutMapAddress.module.css"

const CheckoutMapAddress = () => {
    const [addressValue, setAddressValue] = useState<string>()
    const [descAddressValue, setDescAddressValue] = useState<string>()

    const updateAddressValue = useCallback((name: string, description: string) => {
        setAddressValue(name)
        setDescAddressValue(description)
    }, [])

    return (
        <>
            <div>
                <div className={styles.desc_address}>{descAddressValue}</div>
                <div className={styles.title_address}>{addressValue || "Выберите адрес доставки"}</div>
            </div>
            <MapBlock onChangePlaceMark={updateAddressValue} />
        </>
    )
}

export default CheckoutMapAddress
