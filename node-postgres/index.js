const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");

const item_model = require("./models/item_model");
const folder_model = require("./models/folder_model");
// const user_model = require("./user_model");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // parse requests of type - application/json
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

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const user = await user_model.findByUsername(username);

                if (!user) {
                    return done(null, false, {
                        message: "Incorrect username.",
                    });
                }

                const isPasswordValid = await user_model.verifyPassword(
                    password,
                    user.password
                );

                if (!isPasswordValid) {
                    return done(null, false, {
                        message: "Incorrect password.",
                    });
                }
                return done(null, user);
            } catch (error) {
                return done("passport login error: ", error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await user_model.findById(id);
        done(null, user);
    } catch (error) {
        done("deserialize error: ", error);
    }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
    // Authentication successful
    res.status(200).send({ message: "Login successful!" });
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
    console.log("put items req.body: ", req.body);
    item_model
        .editItem(req.body)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.delete("/folders/:id", (req, res) => {
    console.log("delete folder req.params: ", req.params);
    console.log("delete folder req.body: ", req.body);
    folder_model
        .deleteFolder(req.params.id)
        .then((response) => {
            res.status(200).send(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.post("/folders/:id/move", (req, res) => {
    console.log("move folder req.params: ", req.params);
    console.log("move folder req.body", req.body);
    folder_model
        .moveFolder(req.body)
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
