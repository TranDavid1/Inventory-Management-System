const Pool = require("pg").Pool;

const pool = new Pool({
    user: "david",
    host: "localhost",
    database: "inventory_management_system",
    password: "root",
    port: 5432,
});

const getItems = () => {
    return new Promise(function (resolve, reject) {
        pool.query("SELECT * FROM items ORDER BY id ASC", (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results.rows);
        });
    });
};

const createItem = (body) => {
    return new Promise(function (resolve, reject) {
        const { name, quantity } = body;
        pool.query(
            "INSERT INTO items (name, quantity) VALUES ($1, $2) RETURNING *",
            [name, quantity],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(`A new item has been added: ${results.rows[0]} `);
            }
        );
    });
};

const deleteItem = () => {
    return new Promise(function (resolve, reject) {
        const id = parseInt(request.params.id);
        pool.query("DELETE FROM items WHERE id = $1", [id], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(`Item deleted with ID: ${id}`);
        });
    });
};

module.exports = {
    getItems,
    createItem,
    deleteItem,
};
