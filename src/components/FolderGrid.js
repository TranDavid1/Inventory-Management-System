import React from "react";
import "../css/FolderGrid.css";
import { Grid, Card, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import FolderIcon from "@mui/icons-material/Folder";

function FolderGrid({ filteredFolders }) {
    return (
        <div className="inventory-grid-container__folders-grid">
            <Grid className="grid grid--folders" container spacing={2}>
                {filteredFolders.map((folder) => (
                    <Grid folder xs={12} sm={6} md={4} lg={2} key={folder._id}>
                        <Button className="card-button">
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
        </div>
    );
}

export default FolderGrid;
