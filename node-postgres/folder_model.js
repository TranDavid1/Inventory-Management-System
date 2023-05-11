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
            const { name, parent_folder_id, items, children } = body;
            let response = {};
            let folder_id;

            pool.query(
                "INSERT INTO folders (name) VALUES ($1) RETURNING *",
                [name],
                (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    const newFolder = results.rows[0];
                    folder_id = newFolder.id;
                    response = {
                        message: "A new folder has been added.",
                        folder: {
                            id: newFolder.id,
                            name: newFolder.name,
                        },
                    };

                    if (parent_folder_id) {
                        // insert into folder_relationships
                        pool.query(
                            "INSERT INTO folder_relationships (parent_id, children) VALUES ($1, $2)",
                            [parent_folder_id, folder_id],
                            (error, results) => {
                                if (error) {
                                    pool.query(
                                        "DELETE FROM folders WHERE id = $1",
                                        [folder_id],
                                        (error, results) => {
                                            if (error) {
                                                console.error(error);
                                            }
                                        }
                                    );
                                    console.error(error);
                                    reject(error);
                                } else {
                                    // update children array in the parent folder
                                    pool.query(
                                        "UPDATE folders SET children = array_append(children, $2) WHERE id = $1",
                                        [parent_folder_id, newFolder.id],
                                        (error, results) => {
                                            if (error) {
                                                console.error(error);
                                                reject(error);
                                            }
                                            response = {
                                                message:
                                                    "A new relationship has been added.",
                                                entry: {
                                                    parent_id: parent_folder_id,
                                                    children: newFolder.id,
                                                },
                                            };
                                            resolve(response);
                                        }
                                    );
                                    // update parent_folder_id in the child folder
                                    pool.query(
                                        "UPDATE folders SET parent_folder_id = $1 WHERE id = $2",
                                        [parent_folder_id, newFolder.id],
                                        (error, results) => {
                                            if (error) {
                                                console.error(error);
                                                reject(error);
                                            }
                                            response = {
                                                message:
                                                    "A new relationship has been added.",
                                                entry: {
                                                    parent_id: parent_folder_id,
                                                    children: newFolder.id,
                                                },
                                            };
                                            resolve(response);
                                        }
                                    );
                                    // pool.query(
                                    //     "UPDATE folders SET children = $1 WHERE id = $2",
                                    //     []
                                    // )
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
            // const items = [];
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

    getChildrenInFolder: (id) => {
        return new Promise(function (resolve, reject) {
            // const folders = [];
            pool.query(
                "SELECT folders.id, folders.name FROM folders JOIN folder_relationships ON folders.id = folder_relationships.children WHERE folder_relationships.parent_id = $1",
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
                    }
                    resolve(results.rows);
                }
            );
        });
    },

    deleteFolder: (id) => {
        return new Promise(function (resolve, reject) {
            let response = {};
            // Delete all items in the folder
            pool.query(
                "DELETE FROM folder_items WHERE folder_id = $1",
                [id],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    }
                    response = {
                        message: "All items in the folder have been deleted.",
                    };
                }
            );
            // Delete all child folders and their items
            pool.query(
                "SELECT id FROM folders WHERE parent_folder_id = $1",
                [id],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    }
                    const childIds = results.rows.map((row) => row.id);
                    if (childIds.length === 0) {
                        // If no child folders exist, delete the folder itself
                        pool.query(
                            "DELETE FROM folders WHERE id = $1",
                            [id],
                            (error, results) => {
                                if (error) {
                                    console.error(error);
                                    reject(error);
                                }
                                response = {
                                    message: "The folder has been deleted.",
                                };
                                resolve(response);
                            }
                        );
                    } else {
                        // If child folders exist, delete them recursively
                        childIds.forEach((childId, index) => {
                            folder_model
                                .deleteFolder(childId)
                                .then((childResponse) => {
                                    if (index === childIds.length - 1) {
                                        // After all child folders have been deleted, delete the parent folder
                                        pool.query(
                                            "DELETE FROM folders WHERE id = $1",
                                            [id],
                                            (error, results) => {
                                                if (error) {
                                                    console.error(error);
                                                    reject(error);
                                                }
                                                response = {
                                                    message:
                                                        "The folder and all its children have been deleted.",
                                                };
                                                resolve(response);
                                            }
                                        );
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                    reject(error);
                                });
                        });
                    }
                }
            );
        });
    },
};

module.exports = folder_model;
