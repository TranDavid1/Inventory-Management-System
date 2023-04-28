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
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Grid, Card, CardContent, Typography } from "@mui/material";

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
    const [addFolderOpen, setAddFolderOpen] = useState(false);

    useEffect(() => {
        fetchItems();
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

    // const handleSortOrder = () => {
    //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    // };

    // const handleFilterValue = (event) => {
    //     setFilterValue(event.target.value);
    // };

    // const handleSearchValue = (event) => {
    //     setSearchValue(event.target.value);
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

    const handleSearchBarClick = () => {
        setShowDropdown(true);
    };

    const handleAddNewButtonClick = () => {
        setShowAddNewOptions(!showAddNewOptions);
    };

    function AddItemDialog(props) {
        const { open, onClose } = props;
        const [itemName, setItemName] = useState("");
        const [itemQuantity, setItemQuantity] = useState("");
        const [itemPrice, setItemPrice] = useState("");

        const handleItemNameChange = (event) => {
            setItemName(event.target.value);
        };

        const handleItemQuantityChange = (event) => {
            setItemQuantity(event.target.value);
        };

        const handleItemPriceChange = (event) => {
            setItemPrice(event.target.value);
        };

        const handleAddItem = (event) => {
            event.preventDefault();
            // Add item to the list here
            try {
                const newItem = {
                    itemName: itemName,
                    itemQuantity: itemQuantity,
                    itemPrice: itemPrice,
                };

                console.log("newItem:", newItem);

                // Make an API call to add the new item
                fetch("http://localhost:5000/items/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newItem),
                })
                    .then((res) => res.text())
                    .then((text) => console.log(text))
                    .then(() => {
                        fetchItems();
                        onClose();
                    })
                    .catch((err) => console.error(err));
            } catch (error) {
                console.error(error);
            }
        };

        const handleClose = () => {
            onClose();
        };

        return (
            <Dialog open={open} onClose={handleClose}>
                <h2 className="add-item-form-header">Add Item</h2>
                <form className="add-item-form" onSubmit={handleAddItem}>
                    <div>
                        <label htmlFor="item-name"></label>
                        <input
                            className="item-name-input"
                            type="text"
                            id="item-name"
                            value={itemName}
                            onChange={handleItemNameChange}
                            placeholder="Name*"
                        />
                    </div>
                    <div>
                        <label htmlFor="item-quantity"></label>
                        <input
                            className="item-quantity-input"
                            type="number"
                            id="item-quantity"
                            value={itemQuantity}
                            onChange={handleItemQuantityChange}
                            defaultValue={1}
                            placeholder="Quantity"
                        />
                    </div>
                    <div>
                        <label htmlFor="item-price"></label>
                        <input
                            className="item-price-input"
                            type="number"
                            id="item-price"
                            value={itemPrice}
                            onChange={handleItemPriceChange}
                            placeholder="Price, USD"
                        />
                    </div>
                    <button className="add-item-button" type="submit">
                        Add
                    </button>
                </form>
            </Dialog>
        );
    }

    function AddFolderDialog(props) {
        const { open, onClose } = props;
        const [folderName, setFolderName] = useState("");
        const [tags, setTags] = useState("");
        const [items, setItems] = useState({});
        const [parent, setParent] = useState("");
        const [children, setChildren] = useState({});

        const handleFolderNameChange = (event) => {
            setFolderName(event.target.value);
        };

        const handleFolderTagsChange = (event) => {
            setTags(event.target.value);
        };

        const handleAddFolder = (event) => {
            event.preventDefault();
            // Add item to the list here
            try {
                const newFolder = {
                    folderName: folderName,
                    items: items,
                    parent: parent,
                    children: children,
                    tags: tags,
                };

                console.log("newFolder:", newFolder);

                // Make an API call to add the new item
                fetch("http://localhost:5000/folders/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newFolder),
                })
                    .then((res) => res.text())
                    .then((text) => console.log(text))
                    .then(() => {
                        fetchItems();
                        onClose();
                    })
                    .catch((err) => console.error(err));
            } catch (error) {
                console.error(error);
            }
        };

        const handleClose = () => {
            onClose();
        };

        return (
            <Dialog open={open} onClose={handleClose}>
                <h2 className="add-folder-form-header">Add Folder</h2>
                <form className="add-folder-form" onSubmit={handleAddFolder}>
                    <div>
                        <label htmlFor="folder-name"></label>
                        <input
                            className="folder-name-input"
                            type="text"
                            id="folder-name"
                            value={folderName}
                            onChange={handleFolderNameChange}
                            placeholder="Name*"
                        />
                    </div>
                    <div>
                        <label htmlFor="folder-tags"></label>
                        <input
                            className="folder-tags-input"
                            type="text"
                            id="folder-tags"
                            value={tags}
                            onChange={handleFolderTagsChange}
                            placeholder="Tags"
                        />
                    </div>
                    <button className="add-folder-button" type="submit">
                        Add
                    </button>
                </form>
            </Dialog>
        );
    }

    return (
        <div className="Inventory">
            <div className="sticky-header">
                <h1 className="inventory-header">All Items</h1>
                <div className="add-new">
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
                        // onChange={handleSearchValue}
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
                <div ref={dropDownRef} className="searchBarDropdownText">
                    Type at least 3 characters to search for items and folders
                </div>
            )}
            {/* <div className="inventory-summary">
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
            </div> */}
            {/* <FolderList
                inventory={props.inventory}
                selectedFolder={selectedFolder}
                onFolderChange={setSelectedFolder}
            /> */}

            <div className="inventory-grid">
                <Grid container spacing={2}>
                    {items.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <Card className="item-card">
                                <CardContent>
                                    {/* <Typography variant="h6">
                                        {item.name}
                                    </Typography> */}
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
                                    {/* <Typography variant="subtitle1">
                                        Price: {item.itemPrice}
                                    </Typography> */}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
}

export default Inventory;
