import React, { useState, useEffect, useRef } from "react";
// import * as React from "react";
import "../css/Item.css";
import { Form, Link, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { InputLabel, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import IsoIcon from "@mui/icons-material/Iso";
import Menu from "@mui/material/Menu";

function Item() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [formChanged, setFormChanged] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [name, setName] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const menuRef = useRef(null);

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
                    serial_number: data.serial_number,
                    part_number: data.part_number,
                    memo: data.memo,
                    dimensions: data.dimensions,
                    weight: data.weight,
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
                formValues.quantity !== item.quantity ||
                formValues.serial_number !== item.serial_number ||
                formValues.part_number !== item.part_number ||
                formValues.memo !== item.memo);
        setFormChanged(isFormChanged);
    }, [item, formValues]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("formValues: ", formValues);

        try {
            const response = await fetch(
                `http://localhost:3001/items/${itemId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formValues),
                }
            );
            if (response.ok) {
                const data = await response.json();
                setItem(data);
                alert("Item updated successfully");
                window.location.reload();
            } else {
                alert("Something went wrong.");
            }
        } catch (error) {
            console.error("Error setting item data: ", error);
        }
    };

    const handleInputChange = (e) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [e.target.name]: e.target.value,
        }));
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                handleClose();
            }
        };
        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

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
                        <div className="options-menu-container">
                            <Button
                                id="options-menu-button"
                                aria-controls={
                                    open ? "options-menu" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleClick}
                            >
                                Options
                            </Button>
                            <Menu
                                id="options-menu"
                                aria-labelledby="options-menu-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                            >
                                <MenuItem onClick={handleClose}>
                                    Update Quantity
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    Move to Folder
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    Delete
                                </MenuItem>
                            </Menu>
                        </div>
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
                        <div className="item-sn">S\N: {item.serial_number}</div>
                        <div className="item-pn">P\N: {item.part_number}</div>
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
                            <div className="edit-dimensions-container">
                                <label className="edit-dimensions-label">
                                    Dimensions:
                                </label>
                                <div className="edit-dimensions-input">
                                    <input
                                        className="edit-dimensions"
                                        id="edit-dimensions"
                                        name="dimensions"
                                        value={formValues.dimensions || ""}
                                        label="Dimensions"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="edit-weight-container">
                                <label className="edit-weight-label">
                                    Weight:
                                </label>
                                <div className="edit-weight-input">
                                    <input
                                        className="edit-weight"
                                        id="edit-weight"
                                        name="weight"
                                        value={formValues.weight || ""}
                                        label="Weight"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="edit-serial-number-container">
                                <label className="edit-serial-number-label">
                                    S/N:
                                </label>
                                <div className="edit-serial-number-input">
                                    <input
                                        className="edit-serial-number"
                                        id="edit-serial-number"
                                        name="serial_number"
                                        value={formValues.serial_number || ""}
                                        // label="Serial Number"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="edit-part-number-container">
                                <label className="edit-part-number-label">
                                    P/N:
                                </label>
                                <div className="edit-part-number-input">
                                    <input
                                        className="edit-part-number"
                                        id="edit-part-number"
                                        name="part_number"
                                        value={formValues.part_number || ""}
                                        // label="Serial Number"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="edit-memo-container">
                                <label className="edit-memo-label">Memo:</label>
                                <div className="edit-memo-input">
                                    <textarea
                                        className="edit-memo"
                                        id="edit-memo"
                                        name="memo"
                                        value={formValues.memo || ""}
                                        // label="Serial Number"
                                        onChange={handleInputChange}
                                    />
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
