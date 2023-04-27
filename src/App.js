import logo from "./logo.svg";
import "./App.css";
import React from "react";
import InventoryForm from "./components/InventoryForm";

function App() {
    return (
        <div className="App">
            <h1>Inventory Management App</h1>
            <InventoryForm />
        </div>
    );
}

export default App;
