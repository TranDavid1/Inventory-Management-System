import React, { useState } from "react";
import InventoryItem from "./InventoryItem";
import "../css/Inventory.css";
import FolderList from "./FolderList";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SearchIcon from "@mui/icons-material/Search";

function Inventory(props) {
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterValue, setFilterValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("");

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

    const groupedInventory = props.inventory.reduce((acc, item) => {
        if (!acc[item.folder]) {
            acc[item.folder] = [item];
        } else {
            acc[item.folder].push(item);
        }
        return acc;
    }, {});

    const filteredInventory = sortedInventory.filter((item) => {
        return item.name.toLowerCase().includes(filterValue.toLowerCase());
    });

    const searchedInventory = Object.entries(groupedInventory).map(
        ([folder, items]) => ({
            folder,
            items: items.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
            ),
        })
    );

    const filteredByFolderInventory =
        selectedFolder === ""
            ? searchedInventory
            : searchedInventory.filter(
                  (item) => item.folder === selectedFolder
              );

    const folderCount = Object.keys(groupedInventory).length;

    const itemsNotInFolder = props.inventory.filter((item) => !item.folder);

    const totalItemQuantity = props.inventory.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // return (
    //     <div className="Inventory">
    //         <h2>All Items</h2>
    //         <FolderList
    //             inventory={props.inventory}
    //             selectedFolder={selectedFolder}
    //             onFolderChange={setSelectedFolder}
    //         />
    //         <div>
    //             <label htmlFor="sortOrder">Sort by Name:</label>
    //             <button onClick={handleSortOrder}>
    //                 {sortOrder === "asc" ? "Ascending" : "Descending"}
    //             </button>
    //         </div>
    //         <div>
    //             <label htmlFor="filterValue">Filter by Name:</label>
    //             <input
    //                 type="text"
    //                 id="filterValue"
    //                 value={filterValue}
    //                 onChange={handleFilterValue}
    //             />
    //         </div>
    //         <div>
    //             <label htmlFor="searchValue">Search:</label>
    //             <input
    //                 type="text"
    //                 id="searchValue"
    //                 value={searchValue}
    //                 onChange={handleSearchValue}
    //             />
    //         </div>
    //         <table>
    //             <thead>
    //                 <tr>
    //                     <th>Name</th>
    //                     <th>Description</th>
    //                     <th>Quantity</th>
    //                     <th>Actions</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {searchedInventory.length === 0 ? (
    //                     <tr>
    //                         <td colSpan="4">No items in inventory</td>
    //                     </tr>
    //                 ) : (
    //                     searchedInventory.map((item) => (
    //                         <InventoryItem
    //                             key={item.id}
    //                             item={item}
    //                             onDeleteItem={handleDeleteItem}
    //                             onEditItem={handleEditItem}
    //                         />
    //                     ))
    //                 )}
    //             </tbody>
    //         </table>
    //     </div>
    // );

    return (
        <div className="InventoryList">
            <div className="inventory-options">
                <div className="searchBar">
                    <SearchIcon className="searchIcon" />
                    <label htmlFor="searchValue"></label>
                    <input
                        className="searchInput"
                        type="text"
                        id="searchValue"
                        value={searchValue}
                        onChange={handleSearchValue}
                        placeholder="Search"
                    />
                </div>
                <div className="sort">
                    <label htmlFor="sortOrder"></label>
                    <button className="sortButton" onClick={handleSortOrder}>
                        {sortOrder === "asc" ? (
                            <>
                                Name <ArrowDropUpIcon />
                            </>
                        ) : (
                            <>
                                Name <ArrowDropDownIcon />
                            </>
                        )}
                    </button>
                </div>
                {/* <div>
                    <label htmlFor="filterValue">Filter by Name:</label>
                    <input
                        type="text"
                        id="filterValue"
                        value={filterValue}
                        onChange={handleFilterValue}
                    />
                </div> */}
            </div>
            <div className="inventory-summary">
                <div>
                    <h3>Folders</h3>
                    <p>{Object.keys(groupedInventory).length}</p>
                </div>
                <div>
                    <h3>Items</h3>
                    <p>
                        {props.inventory.filter((item) => !item.folder).length}
                    </p>
                </div>
                <div>
                    <h3>Total Quantity</h3>
                    <p>{props.inventory.length}</p>
                </div>
            </div>
            {/* <FolderList
                inventory={props.inventory}
                selectedFolder={selectedFolder}
                onFolderChange={setSelectedFolder}
            /> */}

            <div className="inventory-grid">
                {Object.entries(groupedInventory).map(([folder, items]) => (
                    <div key={folder} className="inventory-folder">
                        <h3>{folder || "No Folder"}</h3>
                        {items.map((item) => (
                            <InventoryItem
                                key={item.id}
                                item={item}
                                onDeleteItem={handleDeleteItem}
                                onEditItem={handleEditItem}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Inventory;
