import React from "react";
// import "../css/InventoryItem";

function InventoryItem(props) {
    const items = props.items;

    return (
        <div className="inventory">
            {items.map((item) => (
                <InventoryItem key={item.id} item={item} />
            ))}
        </div>
    );
}

export default InventoryItem;
