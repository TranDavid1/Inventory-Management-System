import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import "../css/AddFolderDialog.css";
import FormControl from "@mui/material/FormControl";
import { InputLabel, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";

function AddFolderDialog(props) {
    const { open, onClose } = props;
    const [folderName, setFolderName] = useState("");
    const [tags, setTags] = useState("");
    const [items, setItems] = useState([]);
    const [parent, setParent] = useState(null);
    const [children, setChildren] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState("");

    useEffect(() => {
        fetchItems();
        fetchFolders();
    }, []);

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
                parent: selectedFolderId,
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
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("add folder data:", data);
                    const newFolderId = data._id;
                    if (selectedFolderId)
                        updateParentFolder(selectedFolderId, newFolderId);
                    fetchItems();
                    fetchFolders();
                    onClose();
                });
        } catch (error) {
            console.error(error);
        }
    };

    const updateParentFolder = async (folderId, newChildId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/folders/${folderId}`
            );
            const folder = await response.json();
            console.log("parent folder fetched:", folder);

            const updatedFolder = {
                ...folder,
                children: [...folder.children, newChildId],
            };

            const patchResponse = await fetch(
                `http://localhost:5000/folders/${folderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedFolder),
                }
            );

            if (!patchResponse.ok) {
                throw new Error(`Failed to update folder with id ${folderId}`);
            }

            // Update the state of the parent folder in the folders array
            setFolders((folders) =>
                folders.map((f) => (f._id === folderId ? updatedFolder : f))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleFolderChange = (event) => {
        setSelectedFolderId(event.target.value);
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
                <div>
                    <FormControl className="item-folder-form">
                        <InputLabel
                            className="item-folder-input-label"
                            htmlFor="item-folder"
                            id="folder-select-label"
                        >
                            Add to Folder
                        </InputLabel>
                        <Select
                            className="item-folder-select"
                            id="folder-select-label"
                            value={selectedFolderId}
                            onChange={handleFolderChange}
                            // InputLabel="Folder"
                        >
                            {folders.map((folder) => (
                                <MenuItem value={folder._id}>
                                    {folder.folderName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <button className="add-folder-button" type="submit">
                    Add
                </button>
            </form>
        </Dialog>
    );
}

export default AddFolderDialog;
