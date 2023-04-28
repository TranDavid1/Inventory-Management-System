const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true,
        trim: true,
    },
    itemQuantity: {
        type: Number,
        required: true,
    },
    itemPrice: {
        type: Number,
        required: true,
    },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
