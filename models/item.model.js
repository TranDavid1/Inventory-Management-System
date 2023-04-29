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
    // itemWeight: {
    //     type: Number,
    //     required: true,
    // },
    // itemDimensions: {
    //     type: String,
    //     required: false,
    // },
    // itemCategory: {
    //     type: String,
    //     required: false,
    // },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: null,
    },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
