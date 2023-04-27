import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryList from "./components/InventoryList";
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
                        element={<InventoryList inventory={inventory} />}
                    />
                    <Route
                        path="/dashboard"
                        element={<Dashboard inventory={inventory} />}
                    />
                    <Route
                        path="/items"
                        element={<InventoryList inventory={inventory} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
