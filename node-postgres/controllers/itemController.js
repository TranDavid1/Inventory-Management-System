const item_model = require("../models/item_model");

exports.getItem = async (req, res) => {
    try {
        const items = await item_model.getItems();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error getting items: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
