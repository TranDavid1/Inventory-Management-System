import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="Navbar">
            <ul>
                <li>
                    <Link to="/items">Home</Link>
                </li>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/items">Items</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
