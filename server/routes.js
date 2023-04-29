const router = require("express").Router();
// const Folder = require("../models/folder.model");
const Item = require("../models/item.model");
const Folder = require("../models/folder.model");

router.route("/items/add").post((req, res) => {
    console.log("req.body", req.body);
    const { itemName, itemQuantity, itemPrice, folder } = req.body;
    const newItem = new Item({ itemName, itemQuantity, itemPrice, folder });

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

router.route("/items/:itemId").get((req, res) => {
    const itemId = req.params.itemId;

    Item.findById(itemId)
        .exec()
        .then((item) => {
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            res.json(item);
        })
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/folders/add").post((req, res) => {
    console.log("req.body", req.body);
    const { folderName, items, parent, children, tags } = req.body;
    const newFolder = new Folder({ folderName, items, parent, children, tags });

    newFolder
        .save()
        .then(() => res.json("Folder added!"))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/folders").get((req, res) => {
    Folder.find()
        .then((folders) => res.json(folders))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/folders/:folderId").get((req, res) => {
    const folderId = req.params.folderId;

    Folder.findById(folderId)
        .populate("items children")
        .exec()
        .then((folder) => {
            if (!folder) {
                return res.status(404).json({ message: "Folder not found" });
            }

            res.json(folder);
        })
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/folders/:folderId/items", async (req, res) => {
    // try {
    //     const { itemName, itemQuantity, itemPrice } = req.body;
    //     const folder = await Folder.findById(req.params.folderId);
    //     if (!folder) {
    //         return res.status(404).json({ message: "Folder not found" });
    //     }
    //     const newItem = new Item({ itemName, itemQuantity, itemPrice });
    //     await newItem.save();
    //     folder.items.push(newItem);
    //     await folder.save();
    //     res.status(201).json(newItem);
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: "Internal server error" });
    // }

    const { itemName, itemQuantity, itemPrice } = req.body;
    const folderId = req.params.folderId;

    const newItem = new Item({
        itemName,
        itemQuantity,
        itemPrice,
        folder: folderId,
    });
    newItem
        .save()
        .then((item) => {
            Folder.findById(folderId)
                .then((folder) => {
                    folder.items.push(item._id);
                    folder
                        .save()
                        .then(() => res.json("Item added to folder!"))
                        .catch((err) => res.status(400).json(`Error: ${err}`));
                })
                .catch((err) => res.status(400).json(`Error: ${err}`));
        })
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
