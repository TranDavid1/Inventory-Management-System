import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import "../css/AddItemDialog.css";
import { InputLabel, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

function AddItemDialog(props) {
    const { open, onClose } = props;
    const [itemName, setItemName] = useState("");
    const [itemQuantity, setItemQuantity] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState("");
    const [items, setItems] = useState([]);
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        fetchItems();
        fetchFolders();
    }, []);

    const fetchItems = () => {
        fetch("http://localhost:3001/items")
            .then((res) => res.json())
            .then((data) => {
                console.log("data retrieved: ", data);
                setItems(data);
            })
            .catch((err) => console.error(err));
    };

    const fetchFolders = () => {
        fetch("http://localhost:3001/folders")
            .then((res) => res.json())
            .then((data) => {
                console.log("folders retrieved: ", data);
                setFolders(data);
            })
            .catch((err) => console.error(err));
    };

    const handleItemNameChange = (event) => {
        setItemName(event.target.value);
    };

    const handleItemQuantityChange = (event) => {
        setItemQuantity(event.target.value);
    };

    const handleFolderChange = (event) => {
        setSelectedFolderId(event.target.value);
    };

    const handleAddItem = (event) => {
        event.preventDefault();
        // Add item to the list here

        const newItem = {
            name: itemName,
            quantity: itemQuantity,
            folder_id: selectedFolderId,
        };

        console.log("newItem:", newItem);

        // Make an API call to add the new item
        fetch("http://localhost:3001/items/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newItem),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add item");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Item added successfully: ", data);
                // fetchItems();
                // fetchFolders();
                onClose();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleClose = () => {
        onClose();
        window.location.reload();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <h2 className="add-item-form-header">Add Item</h2>
            <form className="add-item-form" onSubmit={handleAddItem}>
                <div>
                    <label htmlFor="item-name"></label>
                    <input
                        className="item-name-input"
                        type="text"
                        id="item-name"
                        value={itemName}
                        onChange={handleItemNameChange}
                        placeholder="Name*"
                    />
                </div>
                <div>
                    <label htmlFor="item-quantity"></label>
                    <input
                        className="item-quantity-input"
                        type="number"
                        id="item-quantity"
                        value={itemQuantity}
                        onChange={handleItemQuantityChange}
                        placeholder="Quantity"
                    />
                </div>
                {/* <div>
                    <label htmlFor="item-price"></label>
                    <input
                        className="item-price-input"
                        type="number"
                        id="item-price"
                        value={itemPrice}
                        onChange={handleItemPriceChange}
                        placeholder="Price, USD"
                    />
                </div> */}
                <div>
                    <FormControl className="item-folder-form">
                        <InputLabel
                            className="item-folder-input-label"
                            htmlFor="item-folder"
                            id="folder-select-label"
                        >
                            Add to Folder
                        </InputLabel>
                        <Select
                            className="item-folder-select"
                            id="folder-select-label"
                            value={selectedFolderId}
                            onChange={handleFolderChange}
                            // InputLabel="Folder"
                        >
                            {folders.map((folder) => (
                                <MenuItem value={folder.id}>
                                    {folder.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <button className="add-item-button" type="submit">
                    Add
                </button>
            </form>
        </Dialog>
    );
}

export default AddItemDialog;
