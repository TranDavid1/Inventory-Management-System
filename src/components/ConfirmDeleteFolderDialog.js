import React, { useState, useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function ConfirmDeleteFolderDialog(props) {
    const { id, open, onClose } = props;
    const navigate = useNavigate();

    const handleClose = () => {
        onClose();
        window.location.reload();
    };

    const handleDeleteFolder = () => {
        console.log("id: ", id);
        fetch(`http://localhost:3001/folders/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    onClose();
                    // window.location.reload();
                    // navigate("/items");
                    alert("Folder deleted successfully!");
                    console.log("Folder deleted successfully");
                } else {
                    console.log("Error deleting folder");
                }
            })
            .catch((error) => console.error("Error deleting folder", error));
    };

    return (
        <div className="confirm-delete-folder-dialog">
            <Dialog open={open} onClose={handleClose}>
                <h2 className="delete-folder-header">Delete Folder</h2>
                <DeleteIcon className="delete-icon" />
                <span>
                    Are you sure you want to delete this folder along with all
                    its contents?
                </span>
                <Button
                    className="delete-button"
                    variant="contained"
                    onClick={handleDeleteFolder}
                >
                    Delete Folder
                </Button>
            </Dialog>
        </div>
    );
}

export default ConfirmDeleteFolderDialog;
