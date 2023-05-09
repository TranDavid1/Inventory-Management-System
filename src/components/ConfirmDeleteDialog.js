import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import "../css/AddFolderDialog.css";
import FormControl from "@mui/material/FormControl";
import { InputLabel, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";

function ConfirmDeleteDialog(props) {
    // const { id } = useParams();
    const { id, open, onClose } = props;

    const handleClose = () => {
        onClose();
        window.location.reload();
    };

    const handleDeleteItem = () => {
        console.log("id: ", id);
        fetch(`http://localhost:3001/items/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Item deleted successfully");
                } else {
                    console.log("Error deleting item");
                }
            })
            .catch((error) => console.error("Error deleting item", error));
    };

    return (
        <div className="confirm-delete-container">
            <Dialog open={open} onClose={handleClose}>
                <h2 className="delete-item-header">Delete</h2>
                <DeleteIcon className="delete-icon" />
                <span>Are you sure you want to delete this item?</span>
                <Button
                    className="delete-button"
                    variant="contained"
                    onClick={handleDeleteItem}
                >
                    Delete Item
                </Button>
            </Dialog>
        </div>
    );
}

export default ConfirmDeleteDialog;
