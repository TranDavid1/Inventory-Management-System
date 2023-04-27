const router = require("express").Router();
const Folder = require("../models/folder.model");

router.route("/folders/add").post((req, res) => {
    const { name } = req.body;
    const newFolder = new Folder({ name });

    newFolder
        .save()
        .then(() => res.json("Folder added!"))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
