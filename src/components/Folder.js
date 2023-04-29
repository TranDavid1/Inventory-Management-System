import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

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
                                {/* <Paper className="FolderGrid__child-paper">
                                    <Typography
                                        variant="h5"
                                        className="FolderGrid__child-title"
                                    >
                                        {child.folderName}
                                    </Typography>
                                </Paper> */}
                            </Link>
                        </Grid>;
                    })}
                {/* {items.map((item) => {
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
                })} */}
                <Grid className="grid grid--items" container spacing={2}>
                    {items.map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={item._id}>
                            <Card className="card card--item">
                                <CardContent className="card__content">
                                    <div className="card__icon-wrapper">
                                        <DescriptionIcon fontSize="large" />
                                    </div>
                                    <div className="card_item-name">
                                        {item.itemName}
                                    </div>
                                    <Typography
                                        className="card__item-description"
                                        variant="subtitle1"
                                    >
                                        {item.itemQuantity}{" "}
                                        {item.itemQuantity > 1
                                            ? "units"
                                            : "unit"}{" "}
                                        | ${item.itemPrice}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </div>
    );
}

export default Folder;
