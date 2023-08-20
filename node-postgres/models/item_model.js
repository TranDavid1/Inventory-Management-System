const Pool = require("pg").Pool;
require("dotenv").config();
const eventLogger = require("./eventLogger");

const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
});

const item_model = {
    getItems: async () => {
        try {
            const response = await pool.query(
                "SELECT * FROM items ORDER BY id ASC"
            );
            return response.rows;
        } catch (error) {
            console.error("getItems error: ", error);
            throw error;
        }
    },

    createItem: async (body) => {
        try {
            const { name, quantity, folder_id } = body;

            const newItemResponse = await pool.query(
                "INSERT INTO items (name, quantity) VALUES ($1, $2) RETURNING *",
                [name, quantity]
            );

            const newItem = newItemResponse.rows[0];
            const item_id = newItem.id;

            let response = {
                message: "A new item has been added.",
                item: {
                    id: item_id,
                    name: name,
                    quantity: quantity,
                },
            };
            console.log(response);

            // Insert row into folder_items for item-folder association
            if (folder_id) {
                const folderItemQuery =
                    "INSERT INTO folder_items (item_id, folder_id) VALUES ($1, $2)";

                await pool.query(folderItemQuery, [item_id, folder_id]);

                const updateItemQuery =
                    "UPDATE items SET folder_id = $1 WHERE id = $2";

                await pool.query(updateItemQuery, [folder_id, newItem.id]);

                // Insert row into history table using eventLogger
                const eventTimestamp = new Date();
                const description = `Create new item: ${newItem.name} in ${folder_id}`;

                await eventLogger.logEvent(
                    newItem.id,
                    "item",
                    "create",
                    eventTimestamp,
                    description
                );

                response = {
                    message: "A new relationship has been added.",
                    entry: {
                        folder_id: folder_id,
                        item_id: newItem.id,
                    },
                };

                console.log(response);
            } else {
                // Insert row into history table using eventLogger
                const eventTimestamp = new Date();
                const description = `Create new item: ${newItem.name}`;

                await eventLogger.logEvent(
                    newItem.id,
                    "item",
                    "create",
                    eventTimestamp,
                    description
                );
            }

            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    deleteItem: async (id) => {
        try {
            // delete item relationship
            await pool.query("DELETE from folder_items WHERE item_id = $1", [
                id,
            ]);

            // delete item row
            await pool.query("DELETE FROM items WHERE id = $1", [id]);
        } catch (error) {
            console.error("deleteItem error: ", error);
            throw error;
        }
    },

    getItemById: async (id) => {
        try {
            const results = await pool.query(
                "SELECT * FROM items WHERE id = $1",
                [id]
            );
            const item = results.rows[0];
            return JSON.stringify(item);
        } catch (error) {
            console.error("getItemById error: ", error);
            throw error;
        }
    },

    checkItemForFolder: async (id) => {
        try {
            results = await pool.query(
                "SELECT * FROM folder_items WHERE item_id = $1",
                [id]
            );
            const data = results.rows;
            return JSON.stringify(data);
        } catch (error) {
            console.error("checkItemForFolder error: ", error);
            throw error;
        }
    },

    editItem: async (body) => {
        try {
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
            let old_item = {};

            // Fetch the old item data
            const oldItemQueryResult = await pool.query(
                "SELECT * FROM items WHERE id=$1",
                [id]
            );
            old_item = oldItemQueryResult.rows[0];

            // Update the item data
            await pool.query(
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
                ]
            );

            const eventTimestamp = new Date();
            const description = `Updated ${name}: `;

            const new_item = {
                id: id,
                name: name,
                quantity: quantity,
                serial_number: serial_number,
                part_number: part_number,
                memo: memo,
                dimensions: dimensions,
                weight: weight,
            };

            // Compare old_item and new_item to find differences
            for (const key in old_item) {
                if (old_item[key] !== new_item[key]) {
                    description += `${key} changed from ${old_item[key]} to ${new_item[key]}; `;
                }
            }

            // Remove the trailing semicolon and whitespace
            const trimmedDescription = description.trim().slice(0, -1);

            // Insert row into history table
            await pool.query(
                "INSERT INTO history (entity_id, entity_type, event_type, event_timestamp, description) VALUES ($1, $2, $3, $4, $5)",
                [id, "item", "update", eventTimestamp, trimmedDescription]
            );

            response = {
                message: "Item has been edited",
                item: new_item,
            };

            return response;
        } catch (error) {
            console.error("editItem error: ", error);
            throw error;
        }
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
