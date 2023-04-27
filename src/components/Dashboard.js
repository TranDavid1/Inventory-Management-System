import React from "react";

function Dashboard({ inventory }) {
    // calculate total number of unique items
    const uniqueItems = [...new Set(inventory.map((item) => item.name))];
    const totalUniqueItems = uniqueItems.length;

    // calculate the total quantity of all items
    const totalQuantity = inventory.reduce(
        (total, item) => total + parseInt(item.quantity),
        0
    );

    // calculate the total value of all items
    const totalValue = inventory.reduce(
        (total, item) => total + parseInt(item.quantity),
        0
    );

    return (
        <div className="Dashboard">
            <h2>Dashboard</h2>
            <p>Total number of unique items: {totalUniqueItems}</p>
            <p>Total quantity of all items: {totalQuantity}</p>
            <p>Total value of all items:</p>
        </div>
    );
}

export default Dashboard;
