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
            const { name, quantity } = body;
            pool.query(
                "INSERT INTO items (name, quantity) VALUES ($1, $2) RETURNING *",
                [name, quantity],
                (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    const newItem = results.rows[0];
                    const response = {
                        message: "A new item has been added.",
                        item: {
                            id: newItem.id,
                            name: newItem.name,
                            quantity: newItem.quantity,
                        },
                    };
                    resolve(response);
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
};

module.exports = item_model;
