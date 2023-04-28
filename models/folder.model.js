const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    folderName: {
        type: String,
        required: true,
    },

    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            default: [],
        },
    ],
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: null,
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            default: [],
        },
    ],
    tags: {
        type: [String],
        default: [],
    },
});

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;
