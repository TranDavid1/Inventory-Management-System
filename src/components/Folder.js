import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Grid, Paper, Typography } from "@mui/material";

function Folder({ folder }) {
    const { items, children } = folder;

    return (
        <div className="folder-container">
            <Grid className="FolderGrid" container spacing={2}>
                {children.map((child) => {
                    <Grid item key={child._id} className="FolderGrid__child">
                        <Link to={`/folders/${child._id}`}>
                            <Paper className="FolderGrid__child-paper">
                                <Typography
                                    variant="h5"
                                    className="FolderGrid__child-title"
                                >
                                    {child.folderName}
                                </Typography>
                            </Paper>
                        </Link>
                    </Grid>;
                })}
                {items.map((item) => {
                    <Grid item key={item._id} className="FolderGrid__item">
                        <Paper className="FolderGrid__item-paper">
                            <Typography
                                variant="h5"
                                className="FolderGrid__item-title"
                            >
                                {item.itemName}
                            </Typography>
                        </Paper>
                    </Grid>;
                })}
            </Grid>
        </div>
    );
}

export default Folder;
