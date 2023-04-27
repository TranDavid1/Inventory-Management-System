import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import "./App.css";
import Inventory from "./components/Inventory";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";

function App() {
    const [inventory, setInventory] = useState([]);

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Inventory inventory={inventory} />}
                    />
                    <Route
                        path="/dashboard"
                        element={<Dashboard inventory={inventory} />}
                    />
                    <Route
                        path="/items"
                        element={<Inventory inventory={inventory} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
