import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";

function Navbar() {
    return (
        <nav className="Navbar">
            <ul>
                <li>
                    <IconButton
                        component={Link}
                        to="/items"
                        aria-label="Inventory"
                    >
                        <HomeIcon />
                    </IconButton>
                </li>
                <li>
                    <IconButton
                        component={Link}
                        to="/dashboard"
                        aria-label="Dashboard"
                    >
                        <DashboardIcon />
                    </IconButton>
                </li>
                <li>
                    <IconButton
                        component={Link}
                        to="/items"
                        aria-label="Inventory"
                    >
                        <InventoryIcon />
                    </IconButton>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
