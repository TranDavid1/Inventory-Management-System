const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const item_model = require("./item_model");
const folder_model = require("./folder_model");

app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers"
    );
    next();
});

app.get("/items", (req, res) => {
    item_model
        .getItems()
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get("/folders", (req, res) => {
    folder_model
        .getFolders()
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get("/items/:id", (req, res) => {
    item_model
        .getItemById(req.params.id)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.post("/items/add", (req, res) => {
    item_model
        .createItem(req.body)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.delete("/items/:id", (req, res) => {
    item_model
        .deleteItem(req.params.id)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.post("/folders/add", (req, res) => {
    folder_model
        .createFolder(req.body)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get("/folders/:id", (req, res) => {
    folder_model
        .getFolderById(req.params.id)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get("/folders/:id/items", (req, res) => {
    console.log("getItemsInFolder req.params: ", req.params);
    folder_model
        .getItemsInFolder(req.params.id)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get("/folders/:id/children", (req, res) => {
    console.log("getChildrenInFolder req.params: ", req.params);
    folder_model
        .getChildrenInFolder(req.params.id)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get("/items/:id/check-for-folder", (req, res) => {
    console.log("checkItemForFolder req.params: ", req.params);
    item_model
        .checkItemForFolder(req.params.id)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.put("/items/:id", (req, res) => {
    console.log("put items req.params: ", req.params);
    item_model
        .editItem(req.body)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
