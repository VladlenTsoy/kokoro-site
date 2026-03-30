"use client"

import React, {useCallback, useEffect, useRef, useState} from "react"
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

const MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "9253bb8c-35d0-4934-aeb8-795c5416630f"
const GEOCODE_API_KEY = process.env.NEXT_PUBLIC_YANDEX_GEOCODE_API_KEY || MAPS_API_KEY
const DEFAULT_CENTER: [number, number] = [41.311158, 69.279737]
const DEFAULT_ZOOM = 12

interface MapBlockProps {
    onChangePlaceMark?: (name: string, description: string, coords: [number, number]) => void
    externalCoords?: [number, number] | null
}

const TASHKENT_POLYGON_COORDS = tashkentPolygonCoords

const MapBlock: React.FC<MapBlockProps> = ({onChangePlaceMark, externalCoords}) => {
    const mapRef = useRef<any>(null)
    const placeMarkRef = useRef<any>(null)
    const geolocationControlRef = useRef<any>(null)
    const isGeoListenerAttachedRef = useRef(false)
    const [selectedCoordinate, setSelectedCoordinate] = useState<[number, number]>()
    const defaultState = {center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM}

    const getGeocode = useCallback(async (coords: [number, number]) => {
        const res = await fetch(
            `https://geocode-maps.yandex.ru/1.x/?apikey=${GEOCODE_API_KEY}&format=json&geocode=${coords[1]},${coords[0]}`
        )
        const data = await res.json()
        const collection = data.response?.GeoObjectCollection?.featureMember?.map((item: any) => item.GeoObject)
        const firstCollection = collection?.at(0)
        placeMarkRef.current?.properties.set("iconCaption", firstCollection?.name)
        onChangePlaceMark && onChangePlaceMark(firstCollection?.name || "", firstCollection?.description || "", coords)
    }, [onChangePlaceMark])

    const checkCoords = useCallback(async (coords: [number, number], zoom = 15) => {
        await getGeocode(coords)
        setSelectedCoordinate(coords)
        mapRef.current?.setCenter(coords, zoom, {duration: 250})
    }, [getGeocode])

    const clickOnMapHandler = useCallback(async (e: any) => {
        const coords = e.get("coords") as [number, number]
        await checkCoords(coords)
    }, [checkCoords])

    const clickOnPolygonHandler = useCallback(async (e: any) => {
        const coords = e.get("coords") as [number, number]
        await checkCoords(coords)
    }, [checkCoords])

    const geolocationSearchHandler = useCallback(async (e: any) => {
        const coords = e.originalEvent.position as [number, number]
        await checkCoords(coords)
    }, [checkCoords])

    const bindGeolocationEvents = useCallback((inst: any) => {
        geolocationControlRef.current = inst
        if (!inst || !inst.events || isGeoListenerAttachedRef.current) return
        inst.events.add("locationchange", geolocationSearchHandler)
        isGeoListenerAttachedRef.current = true
    }, [geolocationSearchHandler])

    useEffect(() => {
        if (!externalCoords) return
        checkCoords(externalCoords, 17)
    }, [externalCoords, checkCoords])

    useEffect(() => {
        return () => {
            if (!geolocationControlRef.current?.events || !isGeoListenerAttachedRef.current) return
            geolocationControlRef.current.events.remove("locationchange", geolocationSearchHandler)
            isGeoListenerAttachedRef.current = false
        }
    }, [geolocationSearchHandler])

    return <div className={styles.container}>
        <YMaps query={{lang: "ru_RU", apikey: MAPS_API_KEY}}>
            <Map
                instanceRef={mapRef}
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
                        zIndex: 1
                    }}
                    onClick={clickOnPolygonHandler}
                    modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                />
                <Placemark geometry={selectedCoordinate} instanceRef={placeMarkRef} />
                <ZoomControl defaultOptions={{size: "large"}} />
                <GeolocationControl instanceRef={bindGeolocationEvents} />
                <FullscreenControl />
            </Map>
        </YMaps>
    </div>
}

export default React.memo(MapBlock)
