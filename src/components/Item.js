import React, { useState, useEffect, useRef } from "react";
import "../css/Item.css";
import { Form, Link, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { InputLabel, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IsoIcon from "@mui/icons-material/Iso";

function Item() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [formChanged, setFormChanged] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [name, setName] = useState("");

    useEffect(() => {
        const fetchItemData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/items/${itemId}`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                // console.log("response: ", response);
                const data = await response.json();
                // console.log("response json:", response.json());
                console.log("response data:", data);
                setItem(data);
                setName(data.name);
                setFormValues({
                    id: data.id,
                    name: data.name,
                    quantity: data.quantity,
                    // itemPrice: data.itemPrice,
                });
            } catch (error) {
                console.error("Error fetching item data:", error);
            }
        };
        fetchItemData();
    }, []);

    useEffect(() => {
        const isFormChanged =
            item &&
            (formValues.name !== item.name ||
                formValues.quantity !== item.quantity);
        setFormChanged(isFormChanged);
    }, [item, formValues]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("formValues: ", formValues);

        const response = await fetch(`http://localhost:3001/items/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        });

        if (response.ok) {
            const data = await response.json();
            setItem(data);
            alert("Item updated successfully");
            window.location.reload();
        } else {
            alert("Something went wrong.");
        }
    };

    const handleInputChange = (e) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="item-container">
            {item ? (
                <>
                    <div className="item-header">
                        <input
                            className="item-name"
                            name="name"
                            value={formValues.name || ""}
                            onChange={handleInputChange}
                        />
                        {formChanged && (
                            <div className="save-button-container">
                                <Button
                                    className="save-button"
                                    form="edit-item-form"
                                    type="submit"
                                    onClick={handleFormSubmit}
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="item-info">
                        <div className="item-id">Item ID: {item.id}</div>
                        <div className="item-quantity">
                            Quantity: {item.quantity} units
                        </div>
                    </div>
                    <div className="edit-item-form-container">
                        <form className="edit-item-form" id="edit-item-form">
                            <div className="edit-quantity-container">
                                <label className="edit-quantity-label">
                                    Quantity:
                                </label>
                                <div className="edit-quantity-input">
                                    <input
                                        className="edit-quantity"
                                        id="edit-quantity"
                                        name="quantity"
                                        value={formValues.quantity || ""}
                                        label="Quantity"
                                        onChange={handleInputChange}
                                    />
                                    <IsoIcon className="IsoIcon" />
                                </div>
                            </div>
                        </form>
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
