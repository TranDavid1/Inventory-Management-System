import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function ConfirmDeleteItemDialog(props) {
    const { id, open, onClose } = props;
    const navigate = useNavigate();

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
                    onClose();
                    // window.location.reload();
                    // alert("Item deleted successfully!");
                    toast.success("Item deleted successfully!", {
                        position: toast.POSITION.BOTTOM_LEFT,
                    });
                    navigate("/items");
                    console.log("Item deleted successfully");
                } else {
                    toast.error("Error deleting item");
                    // console.log("Error deleting item");
                }
            })
            .catch((error) => {
                console.error("Error deleting item", error);
                // use toast.error to display error notification
                toast.error("Error deleting item: ", error);
            });
    };

    return (
        <div className="confirm-delete-item-container">
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

export default ConfirmDeleteItemDialog;
