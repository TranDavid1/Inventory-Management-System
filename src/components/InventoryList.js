import React, { useState } from "react";
import InventoryItem from "./InventoryItem";
import "../css/InventoryList.css";

function InventoryList(props) {
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterValue, setFilterValue] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const handleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const handleFilterValue = (event) => {
        setFilterValue(event.target.value);
    };

    const handleSearchValue = (event) => {
        setSearchValue(event.target.value);
    };

    const handleDeleteItem = (id) => {
        const updatedInventory = props.inventory.filter(
            (item) => item.id !== id
        );
        props.onDeleteItem(updatedInventory);
    };

    const handleEditItem = (id, updatedItem) => {
        const updatedInventory = props.inventory.map((item) =>
            item.id === id ? updatedItem : item
        );
        props.onEditItem(updatedInventory);
    };

    const sortedInventory = [...props.inventory].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const filteredInventory = sortedInventory.filter((item) => {
        return item.name.toLowerCase().includes(filterValue.toLowerCase());
    });

    const searchedInventory = filteredInventory.filter((item) => {
        return item.name.toLowerCase().includes(searchValue.toLowerCase());
    });

    return (
        <div className="InventoryList">
            <h2>Inventory List</h2>
            <div>
                <label htmlFor="sortOrder">Sort by Name:</label>
                <button onClick={handleSortOrder}>
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                </button>
            </div>
            <div>
                <label htmlFor="filterValue">Filter by Name:</label>
                <input
                    type="text"
                    id="filterValue"
                    value={filterValue}
                    onChange={handleFilterValue}
                />
            </div>
            <div>
                <label htmlFor="searchValue">Search:</label>
                <input
                    type="text"
                    id="searchValue"
                    value={searchValue}
                    onChange={handleSearchValue}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {searchedInventory.length === 0 ? (
                        <tr>
                            <td colSpan="4">No items in inventory</td>
                        </tr>
                    ) : (
                        searchedInventory.map((item) => (
                            <InventoryItem
                                key={item.id}
                                item={item}
                                onDeleteItem={handleDeleteItem}
                                onEditItem={handleEditItem}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryList;
