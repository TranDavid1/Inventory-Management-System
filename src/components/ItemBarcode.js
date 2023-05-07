import React, { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import "../css/ItemBarcode.css";

function ItemBarcode({ item }) {
    const svgRef = useRef(null);
    const [svgText, setSvgText] = useState("");

    useEffect(() => {
        // Combine item id and name to generate barcode text
        const barcodeText = `${item.id} - ${item.name}`;

        // Set barcode text and generate SVG
        setSvgText(barcodeText);
        JsBarcode(svgRef.current, barcodeText, {
            format: "CODE128",
            displayValue: false,
            height: 40,
            width: 1.5,
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
