import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Grid, Paper, Typography } from "@mui/material";

function Folder() {
    const { folderId } = useParams();
    console.log("folderId:", folderId);
    const [folder, setFolder] = useState(null);

    useEffect(() => {
        const fetchFolderData = async () => {
            const response = await fetch(
                `http://localhost:5000/folders/${folderId}`
            );
            const data = await response.json();
            // console.log("response json:", response.json());
            console.log("response data:", data);
            setFolder(data);
        };
        fetchFolderData();
    }, [folderId]);

    if (!folder) {
        return <div>Folder not found</div>;
    }

    const items = folder.items;
    const children = folder.children;
    console.log("items:", items);
    console.log("children", children);

    return (
        <div className="folder-container">
            <Grid className="FolderGrid" container spacing={2}>
                {children &&
                    children.map((child) => {
                        <Grid
                            item
                            key={child._id}
                            className="FolderGrid__child"
                        >
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
                                Test
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
