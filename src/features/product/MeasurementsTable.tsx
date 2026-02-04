import React from "react"
import getTextValue from "@/utils/getTextValue"
import type {ProductVariantMeasurement, ProductVariantSize} from "@/features/product-variants/productVariantsApi"
import {buildMeasurementColumns, buildSizeTitleMap} from "@/features/product/productViewModel"
import styles from "./MeasurementsTable.module.css"

interface MeasurementsTableProps {
    measurements: ProductVariantMeasurement[]
    sizes: ProductVariantSize[] | undefined
}

const MeasurementsTable: React.FC<MeasurementsTableProps> = ({measurements, sizes}) => {
    const sizeTitleById = buildSizeTitleMap(sizes)
    const measurementColumns = buildMeasurementColumns(measurements, sizeTitleById)

    return (
        <table className={styles.container}>
            <thead>
                <tr>
                    <th>Размеры</th>
                    {measurementColumns.map(column => (
                        <th key={column.id}>{column.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {measurements.map(item => (
                    <tr key={item.id}>
                        <td>{getTextValue(item.title)}</td>
                        {measurementColumns.map(column => (
                            <td key={column.id}>
                                {getTextValue(item.descriptions?.[String(column.id)])}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default MeasurementsTable
