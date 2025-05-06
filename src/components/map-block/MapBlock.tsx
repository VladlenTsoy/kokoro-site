"use client"

import React, {useCallback, useRef, useState} from "react"
import styles from "./MapBlock.module.css"
import {
    FullscreenControl,
    GeolocationControl,
    Map,
    Placemark,
    YMaps,
    ZoomControl,
    Polygon
} from "@pbe/react-yandex-maps"
import {tashkentPolygonCoords} from "@/utils/tashkentPolygonCoords"

const API_KEY = "4c39433a-67d6-42f4-b776-4ba711ce9508"

interface MapBlockProps {
    onChangePlaceMark?: (name: string, description: string) => void
}

const TASHKENT_POLYGON_COORDS = tashkentPolygonCoords

const MapBlock: React.FC<MapBlockProps> = ({onChangePlaceMark}) => {
    const polygonRef = useRef()
    const placeMarkRef = useRef()
    const [selectedCoordinate, setSelectedCoordinate] = useState<[number, number]>()
    const defaultState = {
        center: [41.311158, 69.279737],
        zoom: 12
    }

    const getGeocode = useCallback(async (value: string) => {
        const res = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&format=json&geocode=${value}`)
        const data = await res.json()
        const collection = data.response?.GeoObjectCollection?.featureMember?.map((item: any) => item.GeoObject)
        const firstCollection = collection?.at(0)
        // @ts-ignore
        placeMarkRef.current?.properties.set("iconCaption", firstCollection?.name)
        onChangePlaceMark && onChangePlaceMark(firstCollection?.name || "", firstCollection?.description || "")
    }, [onChangePlaceMark])

    const clickOnMapHandler = async (e: any) => {
        const coords = e.get("coords")
        await checkCoords(coords)
    }

    const clickOnPolygonHandler = async (e: any) => {
        const coords = e.get("coords")
        await checkCoords(coords)
    }

    const geolocationSearchHandler = async (e: any) => {
        const coords = e.originalEvent.position
        await checkCoords(coords)
    }

    const checkCoords = async (coords: [number, number]) => {
        await getGeocode(`${coords[1]},${coords[0]}`)
        setSelectedCoordinate(coords)
    }

    return <div className={styles.container}>
        <YMaps query={{lang: "ru_RU", apikey: "4c39433a-67d6-42f4-b776-4ba711ce9508"}}>
            <Map
                onClick={clickOnMapHandler}
                modules={["geocode", "SuggestView", "geolocation"]}
                defaultState={defaultState}
                style={{width: "100%", height: "100%"}}
            >
                <Polygon
                    geometry={TASHKENT_POLYGON_COORDS}
                    options={{
                        fillColor: "rgba(0, 255, 0, 0.1)",
                        strokeColor: "rgba(3,154,0,0.43)",
                        strokeWidth: 2,
                        zIndex: 1,
                        // @ts-ignore
                        pointerEvents: "none"
                    }}
                    onClick={clickOnPolygonHandler}
                    modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                />
                <Placemark geometry={selectedCoordinate} instanceRef={placeMarkRef} />
                <ZoomControl defaultOptions={{size: "large"}} />
                <GeolocationControl
                    instanceRef={inst => {
                        if (inst && inst.events) inst.events.add("locationchange", geolocationSearchHandler)
                    }}
                />
                <FullscreenControl />
            </Map>
        </YMaps>
    </div>
}

export default React.memo(MapBlock)
