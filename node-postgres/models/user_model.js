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
            //
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const query =
                "INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *";
            const values = [username, email, hashedPassword];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("createUser error: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getUserByUsername: async (username) => {
        try {
            const query = "SELECT * FROM users WHERE USERNAME = $1";
            const result = await pool.query(query, [username]);
            return result.rows[0];
        } catch (error) {
            console.error("getUserByUsername error: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getUserByEmail: async (email) => {
        try {
            const query = "SELECT * FROM users WHERE email = $1";
            const result = await pool.query(query, [email]);

            if (result.rows.length === 0) {
                return null; // no user found from the given id
            }

            return result.rows[0];
        } catch (error) {
            console.error("getUserByEmail error: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    verifyPassword: async (password, hashedPassword) => {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            console.error("verifyPassword error: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getUserById: async (id) => {
        try {
            const query = "SELECT * FROM users WHERE id = $1";
            const result = await pool.query(query, [id]);

            if (result.rows.length === 0) {
                return null; // no user found from the given id
            }

            return result.rows[0];
        } catch (error) {
            console.error("getUserById error: ", error);
            res.status(500).json({ message: "Internal Server Error" });
            throw error;
        }
    },

    changePassword: async (userId, newPassword) => {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            const query =
                "UPDATE users SET password = $1 WHERE id = $2 RETURNING *";
            const values = [hashedPassword, userId];
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                throw new Error("User not found");
            }

            return { message: "Password changed successfully" };
        } catch (error) {
            console.error("Change password error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    deleteUser: async (userId) => {
        try {
            const query = "DELETE FROM users WHERE id = $1 RETURNING *";
            const values = [userId];
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                throw new Error("User not found");
            }

            return { message: "User account deleted successfully" };
        } catch (error) {
            console.error("Delete user error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
};

module.export = userModel;
