import Dialog from "@mui/material/Dialog";

function MoveFolderDialog(props) {
    const { id, open, onClose } = props;

    const handleClose = () => {
        onClose();
        window.location.reload();
    };

    return (
        <div className="move-folder-dialog-container">
            <Dialog open={open} onClose={handleClose}></Dialog>
        </div>
    );
}

export default MoveFolderDialog;
