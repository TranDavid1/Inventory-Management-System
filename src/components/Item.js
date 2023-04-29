import React, { useState, useEffect, useRef } from "react";
import "../css/Item.css";
import { Form, Link, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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
                <>
                    <div className="item-header">
                        <h2 className="item-name">{item.itemName}</h2>
                        <div className="save-button-container">
                            <Button className="save-button">Save</Button>
                        </div>
                    </div>
                    <div className="item-info">
                        <div className="item-id">Item ID: {item.id}</div>
                        <div className="item-quantity">
                            Quantity: {item.itemQuantity} units
                        </div>
                    </div>
                    <div className="item-edit-container">
                        <div className="edit-quantity-container">
                            <TextField
                                className="edit-quantity-text-field"
                                variant="standard"
                                id="edit-quantity-text-field"
                                value={item.itemQuantity}
                                label="Quantity"
                            />
                        </div>
                    </div>
                </>
            ) : (
                <p> Loading item...</p>
            )}
            {/* <div className="item-info">
                <div className="item-id">Item ID: {item.id}</div>
                <div className="item-quantity">
                    Quantity: {item.itemQuantity} units
                </div>
            </div> */}
        </div>
    );
}

export default Item;
