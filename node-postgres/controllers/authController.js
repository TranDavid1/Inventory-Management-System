const passport = require("passport");

exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ message: "Login successful!", user });
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    res.status(200).json({ message: "Logout successful!" });
};

exports.logout = (req, res) => {
    req.logout();
    res.status(200).json({ message: "Logout successful!" });
};
