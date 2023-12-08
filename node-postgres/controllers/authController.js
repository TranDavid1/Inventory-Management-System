const user_model = require("../models/user_model");
const passport = require("passport");

const authController = {
    register: async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const existingUser = await user_model.getUserByUsername(username);
            const existingEmail = await user_model.getUserByEmail(email);

            if (existingUser || existingEmail) {
                return res.status(400).json({
                    message:
                        "Username or email is already taken, please try another!",
                });
            }

            const newUser = await user_model.createUser(
                username,
                email,
                password
            );
        } catch (error) {
            console.error("Registration error: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    login: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Internal server error " });
            }
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            req.login(user, (err) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ message: "Internal server error " });
                }
                return res
                    .status(200)
                    .json({ message: "Login successful!", user });
            });
        })(req, res, next);
    },
    logout: (req, res) => {
        req.logout();
        res.status(200).json({ message: "Logout successful!" });
    },
};

module.exports = authController;
