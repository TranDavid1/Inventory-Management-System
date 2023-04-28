const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("./db");

app.use(cors());
app.use(express.json());

// add routes here
const itemsRouter = require("./routes");
app.use("/", itemsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;
