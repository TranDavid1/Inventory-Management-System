const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://<dbuser>:<dbpassword>@<dbhost>:<dbport>/<dbname>";
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to MongoDB");
        db.close();
    }
});
