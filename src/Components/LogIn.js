import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogInImage from "./Images/LoginImage.jpeg";

export default function LogIn() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");
    // const [name, setName] = useState("");
    const CookieName = "mobile_tracker";
    const navigate = useNavigate();
    const ServerIp = "localhost";
    const ServerPort = "9901";

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username === "") {
            alert("Username is required.");
            return;
        } else if (password === "") {
            alert("Password is required.");
            return;
        }
        try {
            let result = await fetch(`http://${ServerIp}:${ServerPort}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            result = await result.json();
            if (result.status === 1) {
                const Data = {
                    AuthToken: result.token,
                    username: username
                }
                const cookieString = `${CookieName}=${JSON.stringify(Data)}`;
                document.cookie = cookieString;
                navigate("/home");
            } else {
                alert("Incorrect Email and password.");
            }
        } catch (error) {
            alert("Server error, please try again.");
        }
    };

    return (
        <>
            <div className="login-container">
                <img className="login-img" width={350} src={LogInImage} alt='Loading...' />
                <form onSubmit={handleSubmit} className="login-form">
                    <h2>Geofencing</h2>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    );
}
