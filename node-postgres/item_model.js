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
            let item_id;

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
                                    pool.query(
                                        "DELETE FROM items WHERE id = $1",
                                        [item_id],
                                        (error, results) => {
                                            if (error) {
                                                console.error(error);
                                            }
                                        }
                                    );
                                    console.error(error);
                                    reject(error);
                                } else {
                                    pool.query(
                                        "UPDATE items SET folder_id = $1 WHERE id = $2",
                                        [folder_id, newItem.id],
                                        (error, results) => {
                                            if (error) {
                                                console.error(error);
                                                reject(error);
                                            }
                                            response = {
                                                message:
                                                    "A new relationship has been added.",
                                                entry: {
                                                    folder_id: folder_id,
                                                    item_id: newItem.id,
                                                },
                                            };
                                            resolve(response);
                                        }
                                    );
                                }
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
            // delete item relationship
            pool.query(
                "DELETE from folder_items WHERE item_id = $1",
                [id],
                (error, result) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    }
                    resolve(`Item relationship deleted with ID: ${id}`);
                }
            );
            // const id = parseInt(request.params.id);
            pool.query(
                "DELETE FROM items WHERE id = $1",
                [id],
                (error, result) => {
                    if (error) {
                        console.error(error);
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
                "SELECT * FROM items WHERE id = $1",
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
                        console.error(error);
                        reject(error);
                    }
                    const data = results.rows;
                    resolve(JSON.stringify(data));
                }
            );
        });
    },

    editItem: (body) => {
        return new Promise(function (resolve, reject) {
            const {
                id,
                name,
                quantity,
                serial_number,
                part_number,
                memo,
                dimensions,
                weight,
            } = body;
            let response = {};
            pool.query(
                "UPDATE items SET name=$2, quantity=$3, serial_number=$4, part_number=$5, memo=$6, dimensions=$7, weight=$8 WHERE id=$1",
                [
                    id,
                    name,
                    quantity,
                    serial_number,
                    part_number,
                    memo,
                    dimensions,
                    weight,
                ],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    }
                    const response = {
                        message: "Item has been edited",
                        item: {
                            id: id,
                            name: name,
                            quantity: quantity,
                            serial_number: serial_number,
                            part_number: part_number,
                            memo: memo,
                            dimensions: dimensions,
                            weight: weight,
                        },
                    };
                    resolve(response);
                }
            );
        });
    },

    // getTotalQuantity: (body) => {
    //     return new Promise(function (resolve, reject) {
    //         const { id } = body;
    //         let response = {};
    //         pool.query(
    //             "SELECT items.id, items.name, SUM(folder_items.quantity) as total_quantity FROM items LEFT JOIN folder_items ON items.id = folder_items.item_id WHERE items.id = $1 GROUP BY items.id, items.name;",
    //             [id],
    //             (error, results) => {
    //                 if (error) {
    //                     console.error(error);
    //                     reject(error);
    //                 }
    //                 if (results) {
    //                     console.log("results: ", results);
    //                 }
    //                 resolve(results.rows);
    //             }
    //         );
    //     });
    // },
};

module.exports = item_model;
