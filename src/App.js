import "./App.css";
import React, { useState } from "react";
import InventoryForm from "./components/InventoryForm";
import InventoryList from "./components/InventoryList";

function App() {
    const [inventory, setInventory] = useState([]);

    const handleAddItem = (newItem) => {
        setInventory([...inventory, newItem]);
    };

    return (
        <div className="App">
            <h1>Inventory Management App</h1>
            <InventoryForm onAddItem={handleAddItem} />
            <InventoryList inventory={inventory} />
        </div>
    );
}

export default App;