import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddItemDialog from "./AddItemDialog";
import AddFolderDialog from "./AddFolderDialog";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

function StickyHeader() {
    const handleAddNewButtonClick = () => {
        setShowAddNewOptions(!showAddNewOptions);
    };
    const [showAddNewOptions, setShowAddNewOptions] = useState(false);
    const [addItemOpen, setAddItemOpen] = useState(false);
    const [addFolderOpen, setAddFolderOpen] = useState(false);

    return (
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
    );
}

export default StickyHeader;
