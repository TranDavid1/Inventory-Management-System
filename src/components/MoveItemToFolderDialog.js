import Dialog from "@mui/material/Dialog";

function MoveItemToFolderDialog(props) {
    const { id, open, onClose } = props;

    const handleClose = () => {
        onClose();
        window.location.reload();
    };

    return (
        <div className="move-folder-dialog-container">
            <Dialog open={open} onClose={handleClose}>
                <h2></h2>
            </Dialog>
        </div>
    );
}

export default MoveItemToFolderDialog;
