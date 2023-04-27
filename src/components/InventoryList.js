import React from "react";
import InventoryItem from "./InventoryItem";

function InventoryList(props) {
    const { inventory } = props.inventory;

    return (
        <div className="InventoryList">
            <h2>Inventory List</h2>
            <ul>
                {inventory.map((item) => {
                    <InventoryItem key={item.id} item={item} />;
                })}
            </ul>
        </div>
    );
}

export default InventoryList;
