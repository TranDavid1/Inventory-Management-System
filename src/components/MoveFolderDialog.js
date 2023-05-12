import React, { useState, useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ContactSupportOutlined } from "@mui/icons-material";

function MoveFolderDialog(props) {
    const { id, open, onClose } = props;
    // const navigate = useNavigate();
    const [folder, setFolder] = useState(null);
    const [selectedFolderId, setSelectedFolderId] = useState("");
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        fetchFolder();
        fetchFolders();
    }, []);

    const fetchFolders = () => {
        fetch("http://localhost:3001/folders")
            .then((res) => res.json())
            .then((data) => {
                console.log("folders retrieved: ", data);
                setFolders(data);
            })
            .catch((err) => console.error(err));
    };

    const fetchFolder = async () => {
        const response = await fetch(`http://localhost:3001/folders/${id}`);
        const data = await response.json();
        // console.log("response json:", response.json());
        console.log("fetched folder: ", data);
        setFolder(data);
    };

    const handleClose = () => {
        onClose();
        window.location.reload();
    };

    const handleSelectFolder = (event) => {
        setSelectedFolderId(event.target.value);
    };

    const handleMoveFolder = () => {
        console.log("id: ", id);
        console.log("selectedFolderId: ", selectedFolderId);
        const moveParams = {
            folder_id: id,
            new_parent_id: selectedFolderId,
        };
        console.log("moveParams: ", moveParams);
        fetch(`http://localhost:3001/folders/${folder.id}/move`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(moveParams),
        })
            .then((response) => {
                if (response.ok) {
                    onClose();
                    // window.location.reload();
                    // navigate("/items");
                    alert("Folder moved successfully!");
                    console.log("Folder moved successfully");
                } else {
                    console.log("Error moving folder");
                }
            })
            .catch((error) => console.error("Error moving folder", error));
    };

    return (
        <div className="move-folder-container">
            <Dialog open={open} onClose={handleClose}>
                <h2 className="move-folder-header">Move Folder</h2>
                <span>Choose Destination Folder:</span>
                <Select
                    className="item-folder-select"
                    id="folder-select-label"
                    value={selectedFolderId}
                    onChange={handleSelectFolder}
                    // InputLabel="Folder"
                >
                    {folders.map((folder) => (
                        <MenuItem value={folder.id}>{folder.name}</MenuItem>
                    ))}
                </Select>
                <Button
                    className="move-button"
                    variant="contained"
                    onClick={handleMoveFolder}
                >
                    Move Folder
                </Button>
            </Dialog>
        </div>
    );
}

export default MoveFolderDialog;
