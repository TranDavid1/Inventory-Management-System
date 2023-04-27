import React from "react";

function InventoryList(props) {
    const { inventory } = props;

    return (
        <div className="InventoryList">
            <h2>Current Inventory</h2>
            <ul>
                {inventory.map((item) => {
                    <li key={item.id}>
                        {item.name} - {item.description} ({item.quantity})
                    </li>;
                })}
            </ul>
        </div>
    );
}

export default InventoryList;
