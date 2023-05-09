import React, { useState, useEffect, useRef } from "react";
import "../css/ItemBarcode.css";

import JsBarcode from "jsbarcode";

function ItemBarcode({ item }) {
    const svgRef = useRef(null);
    const [svgText, setSvgText] = useState("");

    useEffect(() => {
        // Combine item id and name to generate barcode text
        const barcodeText = `${item.id} ${item.name} ${item.serial_number} ${item.part_number} ${item.quantity} ${item.dimensions} ${item.weight} ${item.memo}`;

        // Set barcode text and generate SVG
        setSvgText(barcodeText);
        JsBarcode(svgRef.current, barcodeText, {
            format: "CODE128",
            displayValue: false,
            height: 40,
            width: 0.5,
        });
    }, [item]);

    return (
        <div className="svg-container">
            <svg ref={svgRef} className="svgRef">
                <text className="svgText" x="0" y="60">
                    {svgText}
                </text>
            </svg>
        </div>
    );
}

export default ItemBarcode;
