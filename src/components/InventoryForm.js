import React, { useState } from "react";

function InventoryForm() {
    const [itemName, setItemName] = useState("");
    const [itemDescription, setItemDescription] = useState("");
    const [itemQuantity, setItemQuantity] = useState(0);

    const handleNameChange = (event) => {
        setItemName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setItemDescription(event.target.value);
    };

    const handleQuantityChange = (event) => {
        setItemQuantity(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(
            `Submitting item ${itemName} with description ${itemDescription} and quantity ${itemQuantity}`
        );
        setItemName("");
        setItemDescription("");
    };
}

export default InventoryForm;
