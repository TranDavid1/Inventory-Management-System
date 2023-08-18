import React from "react";
// import "./Dashboard.css";

function Dashboard(props) {
    const { inventory, recentActivity } = props;

    // calculate metrics for summary section
    const numUniqueItems = new Set(inventory.map((item) => item.name)).size;
    const totalQuantity = inventory.reduce(
        (total, item) => total + item.quantity,
        0
    );
    const totalValue = inventory.reduce(
        (total, item) => total + parseInt(item.quantity),
        0
    );

    return (
        <div className="Dashboard">
            <div className="Summary">
                <h2>Inventory Summary</h2>
                <ul>
                    <li>{numUniqueItems} Items</li>
                    <li>{totalQuantity} Total Quantity</li>
                    <li>${totalValue.toFixed(2)} Total Value</li>
                </ul>
            </div>
            {/* <div className="RecentActivity">
                <h2>Recent Activity</h2>
                {recentActivity.length === 0 ? (
                    <p>No recent activity.</p>
                ) : (
                    <ul>
                        {recentActivity.map((activity) => (
                            <li key={activity.timestamp}>{activity.message}</li>
                        ))}
                    </ul>
                )}
            </div> */}
        </div>
    );
}

export default Dashboard;
