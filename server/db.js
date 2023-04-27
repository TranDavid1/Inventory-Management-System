const mongodb = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

mongodb.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongodb.connection;
connection.once("open", () => {
    console.log("MondoDB database connection established successfully");
});
