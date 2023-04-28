const router = require("express").Router();
// const Folder = require("../models/folder.model");
const Item = require("../models/item.model");

router.route("/items/add").post((req, res) => {
    console.log("req.body", req.body);
    const { itemName, itemQuantity, itemPrice } = req.body;
    const newItem = new Item({ itemName, itemQuantity, itemPrice });

    newItem
        .save()
        .then(() => res.json("Item added!"))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/items").get((req, res) => {
    Item.find()
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

// router.route("/folders/add").post((req, res) => {
//     const { name } = req.body;
//     const newFolder = new Folder({ name });

//     newFolder
//         .save()
//         .then(() => res.json("Folder added!"))
//         .catch((err) => res.status(400).json(`Error: ${err}`));
// });

module.exports = router;
