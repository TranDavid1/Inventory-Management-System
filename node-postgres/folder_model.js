const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
});

const folder_model = {
    getFolders: () => {
        return new Promise(function (resolve, reject) {
            pool.query(
                "SELECT * FROM folders ORDER BY id ASC",
                (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results.rows);
                }
            );
        });
    },

    createFolder: (body) => {
        return new Promise(function (resolve, reject) {
            const { name, quantity } = body;
            pool.query(
                "INSERT INTO folders (name, parent_folder_id) VALUES ($1, $2) RETURNING *",
                [name, quantity],
                (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    const newFolder = results.rows[0];
                    const response = {
                        message: "A new folder has been added.",
                        folder: {
                            id: newFolder.id,
                            name: newFolder.name,
                        },
                    };
                    resolve(response);
                }
            );
        });
    },

    getFolderById: (id) => {
        return new Promise(function (resolve, reject) {
            pool.query(
                "SELECT name, parent_folder_id, children, items FROM folders WHERE id = $1",
                [id],
                (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    const item = results.rows[0];
                    resolve(JSON.stringify(item));
                }
            );
        });
    },

    getItemsInFolder: (id) => {
        return new Promise(function (resolve, reject) {
            const items = [];
            pool.query(
                "SELECT items.id, items.name, items.quantity FROM items JOIN folder_items ON items.id = folder_items.item_id WHERE folder_items.folder_id = $1",
                [id],
                (error, results) => {
                    if (error) {
                        console.error(
                            "Error occurred during query execution: ",
                            error
                        );
                        reject(error);
                    }
                    if (results) {
                        console.log("results: ", results);
                        // items = results.rows;
                    }
                    resolve(results.rows);
                }
            );
        });
    },
};

module.exports = folder_model;
