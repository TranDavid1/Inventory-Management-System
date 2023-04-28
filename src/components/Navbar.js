import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import { IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";

function Navbar() {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <nav className="Navbar">
            <ul>
                <li
                    className={activeIndex === 0 ? "active" : ""}
                    onClick={() => handleClick(0)}
                >
                    <div className="inventory-icon-container">
                        <IconButton
                            component={Link}
                            to="/items"
                            aria-label="Inventory"
                            className="MuiIconButton-root"
                            title="Inventory"
                        >
                            <HomeIcon />
                        </IconButton>
                    </div>
                </li>
                <li
                    className={activeIndex === 1 ? "active" : ""}
                    onClick={() => handleClick(1)}
                >
                    <IconButton
                        component={Link}
                        to="/dashboard"
                        aria-label="Dashboard"
                        className="MuiIconButton-root"
                        title="Dashboard"
                    >
                        <DashboardIcon />
                    </IconButton>
                </li>
                <li
                    className={activeIndex === 2 ? "active" : ""}
                    onClick={() => handleClick(2)}
                >
                    <IconButton
                        component={Link}
                        to="/items"
                        aria-label="Inventory"
                        className="MuiIconButton-root"
                        title="Items"
                    >
                        <InventoryIcon />
                    </IconButton>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
