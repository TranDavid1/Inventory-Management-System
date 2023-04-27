import "./App.css";
import React, { useState } from "react";
import InventoryForm from "./components/InventoryForm";
import InventoryList from "./components/InventoryList";

function App() {
    const [inventory, setInventory] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const handleAddItem = (newItem) => {
        setInventory([...inventory, newItem]);
        setShowForm(false);
    };

    const handleShowForm = () => {
        setShowForm(true);
    };

    return (
        <div className="App">
            <h1>Inventory Management App</h1>
            {!showForm && <button onClick={handleShowForm}>Add Item</button>}
            {showForm && <InventoryForm onAddItem={handleAddItem} />}
            <InventoryList inventory={inventory} />
        </div>
    );
}

export default App;
