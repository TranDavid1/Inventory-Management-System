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
                "SELECT id, name, parent_folder_id, children, items FROM folders WHERE id = $1",
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
                "DELETE FROM folder_relationships WHERE parent_id = $1",
                [id],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    }
                    response = {
                        message:
                            "All items in the folder_relationships have been deleted.",
                    };
                }
            );
            pool.query(
                "DELETE FROM folder_items WHERE folder_id = $1",
                [id],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    }
                    response = {
                        message:
                            "All items in the folder_items have been deleted.",
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

    moveFolder: (body) => {
        return new Promise(function (resolve, reject) {
            const { folder_id, new_parent_id } = body;
            // Get the old parent folder ID
            pool.query(
                "SELECT parent_folder_id FROM folders WHERE id = $1",
                [folder_id],
                (error, results) => {
                    if (error) {
                        console.error(
                            "Error occurred during query execution: ",
                            error
                        );
                        reject(error);
                    } else if (!results.rows.length) {
                        const error = new Error(
                            `Folder with id ${folder_id} not found`
                        );
                        console.error(error);
                        reject(error);
                    } else {
                        const old_parent_id = results.rows[0].parent_folder_id;
                        if (new_parent_id === "none") {
                            // delete entry in folder_relationships table
                            pool.query(
                                "DELETE FROM folder_relationships WHERE parent_id = $1 AND children = $2",
                                [old_parent_id, folder_id],
                                (error, results) => {
                                    if (error) {
                                        console.error(
                                            "Error occurred during query execution: ",
                                            error
                                        );
                                        reject(error);
                                    } else {
                                        console.log(
                                            `Folder ${folder_id} has been removed from its parent folder`
                                        );
                                    }
                                }
                            );
                            // update the child folder in folders table
                            pool.query(
                                "UPDATE folders set parent_folder_id = null WHERE id = $1",
                                [folder_id],
                                (error, results) => {
                                    if (error) {
                                        console.error(
                                            "Error occured during query execution: ",
                                            error
                                        );
                                        reject(error);
                                    } else {
                                        console.log(
                                            `Folder ${folder_id} has been updated with null parent_id`
                                        );
                                    }
                                }
                            );
                            // update the parent folder in folders table
                            pool.query(
                                "UPDATE folders set children = null WHERE id = $1",
                                [old_parent_id],
                                (error, results) => {
                                    if (error) {
                                        console.error(
                                            "Error occured during query execution: ",
                                            error
                                        );
                                        reject(error);
                                    } else {
                                        console.log(
                                            `Folder ${folder_id} has been updated with null parent_id`
                                        );
                                    }
                                }
                            );
                        } else {
                            // Update folder_relationships table to move the folder
                            pool.query(
                                "UPDATE folder_relationships SET parent_id = $1 WHERE parent_id = $2 AND children = $3",
                                [new_parent_id, old_parent_id, folder_id],
                                (error, results) => {
                                    if (error) {
                                        console.error(
                                            "Error occurred during query execution: ",
                                            error
                                        );
                                        reject(error);
                                    } else {
                                        if (results.rowCount === 0) {
                                            // If no rows were updated, create a new relationship entry
                                            pool.query(
                                                "INSERT INTO folder_relationships (parent_id, children) VALUES ($1, $2)",
                                                [new_parent_id, folder_id],
                                                (error, results) => {
                                                    if (error) {
                                                        console.error(
                                                            "Error occurred during query execution: ",
                                                            error
                                                        );
                                                        reject(error);
                                                    } else {
                                                        console.log(
                                                            `New relationship entry created for parent ${new_parent_id} and child ${folder_id}`
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                        // Update folders table to update the parent_folder_id
                                        pool.query(
                                            "UPDATE folders SET parent_folder_id = $1 WHERE id = $2",
                                            [new_parent_id, folder_id],
                                            (error, results) => {
                                                if (error) {
                                                    console.error(
                                                        "Error occurred during query execution: ",
                                                        error
                                                    );
                                                    reject(error);
                                                } else {
                                                    resolve({
                                                        message: `Folder ${folder_id} has been moved to folder ${new_parent_id}`,
                                                    });
                                                }
                                            }
                                        );
                                        pool.query(
                                            "UPDATE folders SET children = array_append(children, $2) WHERE id = $1",
                                            [new_parent_id, folder_id],
                                            (error, results) => {
                                                if (error) {
                                                    console.error(
                                                        "Error occurred during query execution: ",
                                                        error
                                                    );
                                                    reject(error);
                                                } else {
                                                    resolve({
                                                        message: `Folder ${folder_id} has been added as a child to Folder ${new_parent_id}`,
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                }
            );
            console.log("move folder complete");
        });
    },
};

module.exports = folder_model;
