import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // const [showNavbar, setShowNavbar] = useState(true);

    const handleLogin = () => {
        // TODO handle auth logic here

        if (username === "demo" && password === "password") {
            // successful login
            setError("");
            // TODO handle redirect here

            // setShowNavbar(true);
            // navigate("/items", { state: { showNavbar } });

            navigate("/items");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="login">
            <h2 className="login__title">Login</h2>
            <div className="login__error">{error}</div>
            <div className="login__input-group">
                <label className="login__label">Username:</label>
                <input
                    type="text"
                    className="login__input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="login__input-group">
                <label className="login__label">Password: </label>
                <input
                    type="password"
                    className="login__input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="login__button" onClick={handleLogin}>
                Log in
            </button>
        </div>
    );
}

export default Login;
