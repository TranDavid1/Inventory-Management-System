const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
});

const item_model = {
    getItems: () => {
        return new Promise(function (resolve, reject) {
            pool.query(
                "SELECT * FROM items ORDER BY id ASC",
                (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results.rows);
                }
            );
        });
    },

    createItem: (body) => {
        return new Promise(function (resolve, reject) {
            const { name, quantity, folder_id } = body;
            let response = {};
            let query = "";
            let params = [name, quantity];

            pool.query(
                "INSERT INTO items (name, quantity) VALUES ($1, $2) RETURNING *",
                [name, quantity],
                (error, results) => {
                    if (error) {
                        reject(error);
                    }

                    const newItem = results.rows[0];
                    const item_id = newItem.id;

                    response = {
                        message: "A new item has been added.",
                        item: {
                            id: item_id,
                            name: name,
                            quantity: quantity,
                        },
                    };

                    if (folder_id) {
                        query =
                            "INSERT INTO folder_items (item_id, folder_id) VALUES ($1, $2)";

                        params.push(folder_id);

                        pool.query(
                            query,
                            [item_id, folder_id],
                            (error, results) => {
                                if (error) {
                                    console.error(
                                        "Error occured during query execution: ",
                                        error
                                    );
                                    reject(error);
                                }

                                response = {
                                    message:
                                        "A new item has been added to the folder.",
                                    item: {
                                        id: item_id,
                                        name: name,
                                        quantity: quantity,
                                        folder_id: folder_id,
                                    },
                                };

                                resolve(response);
                            }
                        );
                    } else {
                        resolve(response);
                    }
                }
            );
        });
    },

    deleteItem: (id) => {
        return new Promise(function (resolve, reject) {
            // const id = parseInt(request.params.id);
            pool.query(
                "DELETE FROM items WHERE id = $1",
                [id],
                (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(`Item deleted with ID: ${id}`);
                }
            );
        });
    },

    getItemById: (id) => {
        return new Promise(function (resolve, reject) {
            pool.query(
                "SELECT name, quantity FROM items WHERE id = $1",
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

    checkItemForFolder: (id) => {
        return new Promise(function (resolve, reject) {
            pool.query(
                "SELECT * FROM folder_items WHERE item_id = $1",
                [id],
                (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    const data = results.rows;
                    resolve(JSON.stringify(data));
                }
            );
        });
    },
};

module.exports = item_model;
