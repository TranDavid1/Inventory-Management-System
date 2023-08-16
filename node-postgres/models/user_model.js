const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
});

const userModel = {
    createUser: async (username, password) => {
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const query =
                "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *";
            const values = [username, hashedPassword];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("createUser error: ", error);
            throw error;
        }
    },
};

module.export = userModel;
