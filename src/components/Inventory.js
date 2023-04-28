import React, { useState, useEffect, useRef } from "react";
import InventoryItem from "./InventoryItem";
import "../css/Inventory.css";
import FolderList from "./FolderList";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderIcon from "@mui/icons-material/Folder";
import Button from "@mui/material/Button";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import AddItemDialog from "../components/AddItemDialog";
import AddFolderDialog from "./AddFolderDialog";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DescriptionIcon from "@mui/icons-material/Description";

function Inventory(props) {
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
    const [totalValue, setTotalValue] = useState(0);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchResultsTotal, setSearchResultsTotal] = useState(0);

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
    }, [filterValue, props.inventory, selectedFolder, dropDownRef]);

    // update filteredItems based on searchValue
    useEffect(() => {
        if (searchValue === "") {
            setFilteredItems(items);
        } else {
            const lowerCaseSearchValue = searchValue.toLowerCase();
            const filtered = items.filter((item) =>
                item.itemName.toLowerCase().includes(lowerCaseSearchValue)
            );
            setFilteredItems(filtered);
        }
    }, [searchValue, items]);

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

    const filteredFolders = folders.filter((folder) =>
        folder.folderName.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSearchBarClick = () => {
        setShowDropdown(true);
        calcTotalValue();
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        if (value === "") {
            setFilteredItems(items);
        } else {
            const filteredItems = items.filter((item) =>
                item.itemName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredItems(filteredItems);
            setSearchResultsTotal(filteredItems.length);
        }
    };

    const handleAddNewButtonClick = () => {
        setShowAddNewOptions(!showAddNewOptions);
    };

    const calcTotalValue = () => {
        let total = 0;
        filteredItems.forEach((item) => {
            total += item.itemPrice * item.itemQuantity;
        });
        setTotalValue(total);
    };

    // const handleSortOrder = () => {
    //     const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    //     setSortOrder(newSortOrder);

    //     const sortedItems = filteredItems.sort((a, b) =>
    //         newSortOrder === "asc"
    //             ? a.itemName.localeCompare(b.itemName)
    //             : b.itemName.localeCompare(a.itemName)
    //     );
    //     setItems(sortedItems);
    // };

    const handleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        const sortedItems = filteredItems.sort((a, b) =>
            compareItems(a, b, newSortOrder)
        );
        setItems(sortedItems);
        const sortedFolders = folders
            .slice()
            .sort((a, b) => compareFolders(a, b, newSortOrder));
        setFolders(sortedFolders);
    };

    const compareItems = (a, b, sortOrder) => {
        const aName = a.itemName.toLowerCase();
        const bName = b.itemName.toLowerCase();
        const aNum = parseInt(aName.match(/\d+/));
        const bNum = parseInt(bName.match(/\d+/));
        if (aNum && bNum) {
            if (aNum !== bNum) {
                return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
            } else {
                const aStr = aName.replace(aNum, "").trim();
                const bStr = bName.replace(bNum, "").trim();
                return sortOrder === "asc"
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr);
            }
        }
        return sortOrder === "asc"
            ? aName.localeCompare(bName)
            : bName.localeCompare(aName);
    };

    const compareFolders = (a, b, sortOrder) => {
        const aName = a.folderName.toLowerCase();
        const bName = b.folderName.toLowerCase();
        if (aName < bName) {
            return sortOrder === "asc" ? -1 : 1;
        }
        if (aName > bName) {
            return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
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
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search"
                        onFocus={handleSearchBarClick}
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
            {showDropDown && (
                <div ref={dropDownRef} className="search-bar-dropdown-text">
                    Type at least 3 characters to search for items and folders
                </div>
            )}
            <div className="inventory-summary">
                <div className="inventory-summary-sec-1">
                    <div>
                        <h3>Folders: {filteredFolders.length}</h3>
                    </div>
                    <div>
                        <h3>Items: {filteredItems.length}</h3>
                    </div>
                    <div>{/* <h3>Total Value: {totalValue}</h3> */}</div>
                </div>

                <div className="inventory-summary-sec-2">
                    Search Results: {searchResultsTotal}
                </div>
            </div>

            <div className="inventory-grid-container">
                <div className="inventory-grid-container__folders-grid">
                    <Grid className="grid grid--folders" container spacing={2}>
                        {filteredFolders.map((folder) => (
                            <Grid
                                folder
                                xs={12}
                                sm={6}
                                md={4}
                                lg={2}
                                key={folder._id}
                            >
                                <Button variant="text" className="card-button">
                                    <Card className="card card--folder">
                                        <CardContent className="card__content">
                                            <div className="card__icon-wrapper">
                                                <FolderIcon fontSize="large" />
                                            </div>
                                            <div className="card__folder-name">
                                                {folder.folderName}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </div>
                <div className="inventory-grid-container__items-grid">
                    <Grid className="grid grid--items" container spacing={2}>
                        {filteredItems.map((item) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={2}
                                key={item._id}
                            >
                                <Card className="card card--item">
                                    <CardContent className="card__content">
                                        <div className="card__icon-wrapper">
                                            <DescriptionIcon fontSize="large" />
                                        </div>
                                        <div className="card_item-name">
                                            {item.itemName}
                                        </div>
                                        <Typography
                                            className="card__item-description"
                                            variant="subtitle1"
                                        >
                                            {item.itemQuantity}{" "}
                                            {item.itemQuantity > 1
                                                ? "units"
                                                : "unit"}{" "}
                                            | ${item.itemPrice}
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
