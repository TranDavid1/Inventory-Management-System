import React, { useState, useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function MoveFolderDialog(props) {
    const { id, open, onClose } = props;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFolder = async () => {
            const response = await fetch(
                `http://localhost:3001/folders/${folderId}`
            );
            const data = await response.json();
            // console.log("response json:", response.json());
            console.log("fetched folder: ", data);
            setFolder(data);
        };
        fetchFolder();
    });

    const handleClose = () => {
        onClose();
        window.location.reload();
    };

    <div className="move-folder-container">
        <Dialog open={open} onClose={handleClose}>
            <h2 className="move-folder-header">Move Folder</h2>
        </Dialog>
    </div>;
}

export default MoveFolderDialog;
