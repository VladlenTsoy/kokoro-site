"use client"

import React, {useCallback, useState} from "react"
import MapBlock from "@/components/map-block/MapBlock"
import styles from "./CheckoutMapAddress.module.css"

interface CheckoutMapAddressProps {
    showError?: boolean
    onAddressChange?: (payload: {
        title: string
        description: string
        location: {
            lat: number
            lng: number
        }
    }) => void
}

const CheckoutMapAddress: React.FC<CheckoutMapAddressProps> = ({showError = false, onAddressChange}) => {
    const [addressValue, setAddressValue] = useState<string>()
    const [descAddressValue, setDescAddressValue] = useState<string>()
    const [externalCoords, setExternalCoords] = useState<[number, number] | null>(null)

    const updateAddressValue = useCallback((name: string, description: string, coords: [number, number]) => {
        setAddressValue(name)
        setDescAddressValue(description)
        onAddressChange?.({
            title: name,
            description,
            location: {
                lat: coords[0],
                lng: coords[1]
            }
        })
    }, [onAddressChange])

    const onFindMeClick = () => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition(
            position => {
                setExternalCoords([position.coords.latitude, position.coords.longitude])
            },
            () => {
                setExternalCoords(null)
            },
            {enableHighAccuracy: true, timeout: 10000}
        )
    }

    return (
        <>
            <div className={styles.address_header}>
                <div className={styles.desc_address}>{descAddressValue}</div>
                <div className={styles.address_row}>
                    <div className={`${styles.title_address} ${showError && !addressValue ? styles.title_address_error : ""}`}>
                        {addressValue || "Выберите адрес доставки"}
                    </div>
                    <button type="button" className={styles.find_me_button} onClick={onFindMeClick}>
                        Найти меня
                    </button>
                </div>
            </div>
            <MapBlock onChangePlaceMark={updateAddressValue} externalCoords={externalCoords} />
        </>
    )
}

export default CheckoutMapAddress
