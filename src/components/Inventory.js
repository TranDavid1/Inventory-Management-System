import React, { useState, useEffect, useRef } from "react";
import InventoryItem from "./InventoryItem";
import "../css/Inventory.css";
import FolderList from "./FolderList";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderIcon from "@mui/icons-material/Folder";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import AddItemDialog from "../components/AddItemDialog";
import AddFolderDialog from "./AddFolderDialog";

function Inventory() {
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterValue, setFilterValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("");
    const [showDropDown, setShowDropdown] = useState(false);
    const dropDownRef = useRef(null);
    const [showAddNewOptions, setShowAddNewOptions] = useState(false);
    const [addItemOpen, setAddItemOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [folders, setFolders] = useState([]);
    const [addFolderOpen, setAddFolderOpen] = useState(false);
    const [searchItemCount, setSearchItemCount] = useState(0);

    useEffect(() => {
        fetchItems();
        fetchFolders();
        console.log("updated items:", items);
        const handleClickOutside = (event) => {
            if (
                dropDownRef.current &&
                !dropDownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropDownRef]);

    const fetchItems = () => {
        fetch("http://localhost:5000/items")
            .then((res) => res.json())
            .then((data) => {
                console.log("data retrieved: ", data);
                setItems(data);
            })
            .catch((err) => console.error(err));
    };

    const fetchFolders = () => {
        fetch("http://localhost:5000/folders")
            .then((res) => res.json())
            .then((data) => {
                console.log("folders retrieved: ", data);
                setFolders(data);
            })
            .catch((err) => console.error(err));
    };

    // const handleSortOrder = () => {
    //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    // };

    // const handleFilterValue = (event) => {
    //     setFilterValue(event.target.value);
    // };

    // const handleDeleteItem = (id) => {
    //     const updatedInventory = props.inventory.filter(
    //         (item) => item.id !== id
    //     );
    //     props.onDeleteItem(updatedInventory);
    // };

    // const handleEditItem = (id, updatedItem) => {
    //     const updatedInventory = props.inventory.map((item) =>
    //         item.id === id ? updatedItem : item
    //     );
    //     props.onEditItem(updatedInventory);
    // };

    // const sortedInventory = [...props.inventory].sort((a, b) => {
    //     if (sortOrder === "asc") {
    //         return a.name.localeCompare(b.name);
    //     } else {
    //         return b.name.localeCompare(a.name);
    //     }
    // });

    // const groupedInventory = props.inventory.reduce((acc, item) => {
    //     if (!acc[item.folder]) {
    //         acc[item.folder] = [item];
    //     } else {
    //         acc[item.folder].push(item);
    //     }
    //     return acc;
    // }, {});

    // const filteredInventory = sortedInventory.filter((item) => {
    //     return item.name.toLowerCase().includes(filterValue.toLowerCase());
    // });

    // const searchedInventory = Object.entries(groupedInventory).map(
    //     ([folder, items]) => ({
    //         folder,
    //         items: items.filter((item) =>
    //             item.name.toLowerCase().includes(searchValue.toLowerCase())
    //         ),
    //     })
    // );

    // const filteredByFolderInventory =
    //     selectedFolder === ""
    //         ? searchedInventory
    //         : searchedInventory.filter(
    //               (item) => item.folder === selectedFolder
    //           );

    // const folderCount = Object.keys(groupedInventory).length;

    // const itemsNotInFolder = props.inventory.filter((item) => !item.folder);

    // const totalItemQuantity = props.inventory.reduce(
    //     (total, item) => total + item.quantity,
    //     0
    // );

    const filteredItems = items.filter((item) =>
        item.itemName.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredFolders = folders.filter((folder) =>
        folder.folderName.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSearchBarClick = () => {
        setShowDropdown(true);
    };

    const handleAddNewButtonClick = () => {
        setShowAddNewOptions(!showAddNewOptions);
    };

    return (
        <div className="Inventory">
            <div className="sticky-header">
                <h1 className="inventory-header">All Items</h1>
                <div className="add-new-options-container">
                    <Button
                        className="add-new-button"
                        variant="contained"
                        onClick={handleAddNewButtonClick}
                    >
                        <>
                            <AddIcon /> Add New
                        </>
                    </Button>
                    {showAddNewOptions && (
                        <div className="add-new-options">
                            <Button
                                className="add-item-button"
                                variant="contained"
                                onClick={() => setAddItemOpen(true)}
                            >
                                <>
                                    <PostAddIcon />
                                    Add Item
                                </>
                            </Button>
                            <Button
                                className="add-folder-button"
                                variant="contained"
                                onClick={() => setAddFolderOpen(true)}
                            >
                                <>
                                    <CreateNewFolderIcon />
                                    Add Folder
                                </>
                            </Button>
                        </div>
                    )}
                    <AddItemDialog
                        open={addItemOpen}
                        onClose={() => setAddItemOpen(false)}
                    />
                    <AddFolderDialog
                        open={addFolderOpen}
                        onClose={() => setAddFolderOpen(false)}
                    />
                </div>
            </div>
            <div className="inventory-options">
                <div className="searchBar">
                    <SearchIcon className="searchIcon" />
                    <label htmlFor="searchValue"></label>
                    <input
                        className="searchInput"
                        type="text"
                        id="searchValue"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search"
                        onFocus={handleSearchBarClick}
                    />
                </div>
                {/* <div className="sort">
                    <label htmlFor="sortOrder"></label>
                    <button
                        className="sortButton"
                        // onClick={handleSortOrder}
                    >
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
                </div> */}
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
            {showDropDown && (
                <div ref={dropDownRef} className="search-bar-dropdown-text">
                    Type at least 3 characters to search for items and folders
                </div>
            )}
            <div className="inventory-summary">
                <div>
                    <h3>Folders: {filteredFolders.length}</h3>
                </div>
                <div>
                    <h3>Items: {filteredItems.length}</h3>
                </div>
            </div>

            <div className="inventory-grid-container">
                <div className="folders-grid">
                    <Grid container spacing={2}>
                        {filteredFolders.map((folder) => (
                            <Grid
                                folder
                                xs={12}
                                sm={6}
                                md={4}
                                lg={2}
                                key={folder._id}
                            >
                                <Card className="folder-card">
                                    <CardContent>
                                        <div className="icon-wrapper">
                                            <FolderIcon fontSize="large" />
                                        </div>
                                        <div className="folder-card-name">
                                            {folder.folderName}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
                <div className="items-grid">
                    <Grid container spacing={2}>
                        {filteredItems.map((item) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={2}
                                key={item._id}
                            >
                                <Card className="item-card">
                                    <CardContent>
                                        <div className="item-card-name">
                                            {item.itemName}
                                        </div>
                                        <Typography
                                            className="item-card-description"
                                            variant="subtitle1"
                                        >
                                            {item.itemQuantity} unit | $
                                            {item.itemPrice}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default Inventory;
