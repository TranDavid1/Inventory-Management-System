import React, { useState, useEffect, useRef } from "react";
import "../css/Item.css";
import { Link, useParams } from "react-router-dom";

function Item() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        const fetchItemData = async () => {
            const response = await fetch(
                `http://localhost:5000/items/${itemId}`
            );
            const data = await response.json();
            // console.log("response json:", response.json());
            console.log("response data:", data);
            setItem(data);
        };
        fetchItemData();
    }, []);

    return (
        <div className="item-container">
            {item ? (
                <h2 className="item-header">{item.itemName}</h2>
            ) : (
                <p> Loading item...</p>
            )}
        </div>
    );
}

export default Item;
