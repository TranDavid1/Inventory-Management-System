import React, { useState, useEffect, useRef } from "react";
import "../css/Inventory.css";

import FolderGrid from "./FolderGrid";
import ItemGrid from "./ItemGrid";
import StickyHeader from "./StickyHeader";

import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function Inventory(props) {
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterValue, setFilterValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [selectedFolder, setSelectedFolder] = useState("");
    const [showDropDown, setShowDropdown] = useState(false);
    const dropDownRef = useRef(null);
    const [showAddNewOptions, setShowAddNewOptions] = useState(false);
    const [items, setItems] = useState([]);
    const [folders, setFolders] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchResultsTotal, setSearchResultsTotal] = useState(0);
    const [showFolderGrid, setShowFolderGrid] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    useEffect(() => {
        setShowSearchResults(false);
        fetchItems();
        // checkItemsForFolder();
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
        } else if (searchValue.length > 2) {
            const lowerCaseSearchValue = searchValue.toLowerCase();
            const filtered = items.filter((item) =>
                item.name.toLowerCase().includes(lowerCaseSearchValue)
            );
            setFilteredItems(filtered);
        }
    }, [searchValue, items]);

    const fetchItems = () => {
        fetch("http://localhost:3001/items")
            .then((res) => res.json())
            .then((data) => {
                console.log("fetchItems data retrieved: ", data);
                setItems(data);
            })
            .catch((err) => console.error(err));
    };

    const fetchFolders = () => {
        fetch("http://localhost:3001/folders")
            .then((res) => res.json())
            .then((data) => {
                console.log("fetchFolders data retrieved: ", data);
                setFolders(data);
            })
            .catch((err) => console.error(err));
    };

    // const checkItemsForFolder = (id) => {
    //     fetch(`http://localhost:3001/${id}/check-for-folder`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log("checkItemsForFolder data retrieved: ", data);
    //         })
    //         .catch((err) => console.error(err));
    // };

    const filteredFolders = folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSearchBarClick = (e) => {
        setShowDropdown(true);
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        if (value === "" || value < 2) {
            setFilteredItems(items);
            // setSearchResultsTotal(filteredItems.length);
            setShowSearchResults(false);
        } else if (value.length > 2) {
            const filteredItems = items.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredItems(filteredItems);
            setSearchResultsTotal(filteredItems.length);
            setShowSearchResults(true);
        }
    };

    const handleAddNewButtonClick = () => {
        setShowAddNewOptions(!showAddNewOptions);
    };

    const handleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        if (filteredItems) {
            const sortedItems = filteredItems.sort((a, b) =>
                compareItems(a, b, newSortOrder)
            );
            setItems(sortedItems);
        }

        if (folders) {
            const sortedFolders = folders
                .slice()
                .sort((a, b) => compareFolders(a, b, newSortOrder));
            setFolders(sortedFolders);
        }
    };

    const compareItems = (a, b, sortOrder) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
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
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName < bName) {
            return sortOrder === "asc" ? -1 : 1;
        }
        if (aName > bName) {
            return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
    };

    const handleFolderCardButtonClick = () => {
        setShowFolderGrid(!showFolderGrid);
    };

    // const handleItemCardButtonClick = () => {
    //     set
    // }

    return (
        <div className="Inventory">
            <StickyHeader />
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
                    {/* <div>
                        <h3>Folders: {filteredFolders.length}</h3>
                    </div>
                    <div>
                        <h3>Items: {filteredItems.length}</h3>
                    </div> */}
                </div>
                {/* {showSearchResults && (
                    <div className="inventory-summary-sec-2">
                        Search Results: {searchResultsTotal}
                    </div>
                )} */}
            </div>

            <div className="inventory-grid-container">
                <FolderGrid folders={filteredFolders} />
                <ItemGrid items={filteredItems} />
            </div>
        </div>
    );
}

export default Inventory;
