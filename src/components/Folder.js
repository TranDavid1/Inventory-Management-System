import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import "../css/Folder.css";
import StickyHeader from "./StickyHeader";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function Folder() {
    const { folderId } = useParams();
    console.log("folderId:", folderId);
    const [folder, setFolder] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchResultsTotal, setSearchResultsTotal] = useState(0);
    const [showDropDown, setShowDropdown] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    const [sortOrder, setSortOrder] = useState("asc");
    const [items, setItems] = useState([]);
    const [folders, setFolders] = useState([]);
    const dropDownRef = useRef(null);
    // const [filteredFolders, setFilteredFolders] = useState([]);

    useEffect(() => {
        const fetchFolderData = async () => {
            const response = await fetch(
                `http://localhost:5000/folders/${folderId}`
            );
            const data = await response.json();
            // console.log("response json:", response.json());
            console.log("response data:", data);
            setFolder(data);
            setItems(data.items);
        };
        fetchFolderData();
        // if (folder) setItems(folder.items);
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
    }, [folderId, dropDownRef, items]);

    if (!folder) {
        return <div>Folder not found</div>;
    }

    const handleSearch = (value) => {
        setSearchValue(value);
        if (value === "") {
            setFilteredItems(items);
            // setSearchResultsTotal(filteredItems.length);
            setShowSearchResults(false);
        } else if (value.length > 2) {
            const filteredItems = items.filter((item) =>
                item.itemName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredItems(filteredItems);
            setSearchResultsTotal(filteredItems.length);
            setShowSearchResults(true);
        }
    };

    const handleSearchBarClick = (e) => {
        setShowDropdown(true);
        calcTotalValue();
    };

    const calcTotalValue = () => {
        let total = 0;
        filteredItems.forEach((item) => {
            total += item.itemPrice * item.itemQuantity;
        });
        setTotalValue(total);
    };

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

    const children = folder.children;
    console.log("items:", items);
    console.log("children", children);

    return (
        <div className="folder-container">
            <StickyHeader />
            <div className="folder-options">
                <div className="searchBar">
                    <SearchIcon className="searchIcon" />
                    <label htmlFor="searchValue"></label>
                    <input
                        className="searchInput"
                        type="text"
                        id="searchValue"
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search All Items"
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
            </div>
            {showDropDown && (
                <div ref={dropDownRef} className="search-bar-dropdown-text">
                    Type at least 3 characters to search for items and folders
                </div>
            )}
            <div className="inventory-summary">
                <div className="inventory-summary-sec-1">
                    <div>
                        <h3>Folders: {folder.children.length}</h3>
                    </div>
                    <div>
                        <h3>Items: {folder.items.length}</h3>
                    </div>
                    <div>{/* <h3>Total Value: {totalValue}</h3> */}</div>
                </div>
                {showSearchResults && (
                    <div className="inventory-summary-sec-2">
                        Search Results: {searchResultsTotal}
                    </div>
                )}
            </div>
            <Grid className="FolderGrid" container spacing={2}>
                {children &&
                    children.map((child) => {
                        <Grid
                            item
                            key={child._id}
                            className="FolderGrid__child"
                        >
                            <Link to={`/folders/${child._id}`}>
                                {/* <Paper className="FolderGrid__child-paper">
                                    <Typography
                                        variant="h5"
                                        className="FolderGrid__child-title"
                                    >
                                        {child.folderName}
                                    </Typography>
                                </Paper> */}
                            </Link>
                        </Grid>;
                    })}
                {/* {items.map((item) => {
                    <Grid item key={item._id} className="FolderGrid__item">
                        <Paper className="FolderGrid__item-paper">
                            <Typography
                                variant="h5"
                                className="FolderGrid__item-title"
                            >
                                Test
                                {item.itemName}
                            </Typography>
                        </Paper>
                    </Grid>;
                })} */}
                <div className="inventory-grid-container__items-grid">
                    <Grid className="grid grid--items" container spacing={2}>
                        {items.map((item) => (
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
            </Grid>
        </div>
    );
}

export default Folder;
