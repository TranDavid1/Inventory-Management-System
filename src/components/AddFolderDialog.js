import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";

function AddFolderDialog(props) {
    const { open, onClose } = props;
    const [folderName, setFolderName] = useState("");
    const [tags, setTags] = useState("");
    const [items, setItems] = useState([]);
    const [parent, setParent] = useState(null);
    const [children, setChildren] = useState([]);
    const [folders, setFolders] = useState([]);

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
                    fetchFolders();
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

export default AddFolderDialog;
