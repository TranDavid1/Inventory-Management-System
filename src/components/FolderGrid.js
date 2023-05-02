import React, { useState } from "react";
import "../css/FolderGrid.css";
import Folder from "./Folder";
import { Grid, Card, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import FolderIcon from "@mui/icons-material/Folder";
import { Link } from "react-router-dom";

function FolderGrid({ folders }) {
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    console.log("FolderGrid folders:", folders);

    const handleFolderButtonClick = (folderId) => {
        setSelectedFolderId(folderId);
    };

    return (
        <div className="inventory-grid-container__folders-grid">
            <Grid className="grid grid--folders" container spacing={2}>
                {folders
                    .filter((item) => item.parent === null)
                    .map((folder) => (
                        <Grid
                            folder
                            xs={12}
                            sm={6}
                            md={4}
                            lg={2}
                            key={folder._id}
                        >
                            <Button
                                component={Link}
                                to={`/folder/${folder._id}`}
                                className="card-button"
                                onClick={() =>
                                    handleFolderButtonClick(folder._id)
                                }
                            >
                                <Card className="card card--folder">
                                    <CardContent className="card__content">
                                        <div className="card__icon-wrapper">
                                            <FolderIcon fontSize="large" />
                                        </div>
                                        <div className="card__folder-name">
                                            {folder.folderName}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Button>
                        </Grid>
                    ))}
            </Grid>
            {/* {selectedFolderId && (
                <div>
                    <Folder folderId={selectedFolderId} />
                </div>
            )} */}
        </div>
    );
}

export default FolderGrid;
