import React from "react";
// import "../css/InventoryItem";

function InventoryItem(props) {
    const item = props.item;

    return (
        <li>
            {item.name} - {item.quantity} - {item.folder}
        </li>
    );
}

export default InventoryItem;
