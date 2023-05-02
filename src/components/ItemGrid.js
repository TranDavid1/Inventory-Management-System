import React, { useState, useEffect, useRef } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import DescriptionIcon from "@mui/icons-material/Description";

function ItemGrid({ items }) {
    console.log("ItemGrid items:", items);

    return (
        <div className="inventory-grid-container__items-grid">
            <Grid className="grid--items" container spacing={2}>
                {items
                    .filter((item) => item.folder === null)
                    .map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={item._id}>
                            <Button
                                component={Link}
                                to={`/item/${item._id}`}
                                className="card-button"
                                // onClick={() =>
                                //     handleFolderButtonClick(folder._id)
                                // }
                            >
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
                            </Button>
                        </Grid>
                    ))}
            </Grid>
        </div>
    );
}

export default ItemGrid;
