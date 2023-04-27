import React, { useState } from "react";

function InventoryForm(props) {
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemQuantity, setItemQuantity] = useState(0);
    const [itemPhoto, setItemPhoto] = useState(null);

    const handleNameChange = (event) => {
        setItemName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setItemDescription(event.target.value);
    };

    const handleQuantityChange = (event) => {
        setItemQuantity(event.target.value);
    };

    const handlePhotoChange = (event) => {
        setItemPhoto(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newItem = {
            id: Date.now(),
            name: itemName,
            description: itemDescription,
            quantity: itemQuantity,
            photo: itemPhoto,
        };

        props.onAddItem(newItem);
        // console.log(
        //     `Submitting item ${itemName} with description ${itemDescription} and quantity ${itemQuantity}`
        // );
        setItemName("");
        setItemDescription("");
        setItemQuantity(0);
        setItemPhoto(null);
    };

    return (
        <div className="InventoryForm">
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={itemName}
                    onChange={handleNameChange}
                    required
                />
                <label htmlFor="description">Description:</label>
                <input
                    type="description"
                    id="description"
                    value={itemDescription}
                    onChange={handleDescriptionChange}
                    required
                />
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    value={itemQuantity}
                    onChange={handleQuantityChange}
                    required
                />
                <label htmlFor="photo">Photo:</label>
                <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    required
                />
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
}

export default InventoryForm;
