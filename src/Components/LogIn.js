import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogInImage from "./Images/LoginImage.jpeg";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function LogIn() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setotp] = useState("");
    const [timerShow, setTimerShow] = useState(true);
    const [timeLeft, setTimeLeft] = useState(localStorage.getItem('timeLeft') ? parseInt(localStorage.getItem('timeLeft')) : 60);
    const [name, setName] = useState("");
    const [showForgetForm, setShowForgetForm] = useState(false);
    const [showChangeForm, setShowChangeForm] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const CookieName = process.env.REACT_APP_COOKIE_NAME_IP || "geofencing";
    const navigate = useNavigate();
    const SERVER_IP = process.env.REACT_APP_SERVER_IP || "localhost";
    const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || "9901";
    const SERVER_URL = process.env.SERVER_URL || `${SERVER_IP}${SERVER_PORT}`;
    const SERVER_SECURE = process.env.REACT_APP_SERVER_SECURE || "http://";

    useEffect(() => {
        if (!timerShow) return;
        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                setTimerShow(false);
            } else {
                setTimeLeft(prevTime => {
                    const newTime = prevTime - 1;
                    localStorage.setItem('timeLeft', newTime);
                    return newTime;
                });
            }
        }, 2000);
        return () => clearInterval(timerInterval);
    }, [timerShow, timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    };

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
            let result = await fetch(`${SERVER_SECURE}${SERVER_URL}/api/login`, {
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

    const ForgetPasswordCall = () => {
        setShowForgetForm(!showForgetForm);
        setShowSignUpForm(false);
        setShowChangeForm(false);
    }

    const handleSubmitFrogetCall = async () => {
        if (!username || username.trim() === '') {
            alert('Please enter a valid username.');
            return;
        }
        if (!password || password.trim() === '') {
            alert('Please enter a valid password.');
            return;
        }
        if (!confirmPassword || confirmPassword.trim() === '') {
            alert('Please confirm your password.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (!otp || otp.trim() === '') {
            alert('Please enter a valid OTP.');
            return;
        }
        try {
            const response = await fetch(`${SERVER_SECURE}${SERVER_URL}/api/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password: password, otp: otp }),
            });
            const result = await response.json();
            if (result.status === 1) {
                alert('Password reset successfully!');
                setShowForgetForm(false);
            } else {
                alert(result.message || 'Failed to send data, please try again later.');
            }
        } catch (error) {
            alert('An error occurred while processing your request. Please try again later.');
        }
    };

    const HandleSendotp = async (callName) => {
        if (timerShow) {
            alert(`Please wait... Time remaining: ${formatTime(timeLeft)}`);
            return;
        }
        if (username === null || username.trim() === '') {
            alert('Please enter a valid username.');
            return;
        }
        try {
            const response = await fetch(`${SERVER_SECURE}${SERVER_URL}/api/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, callName: callName }),
            });
            const result = await response.json();
            if (result.status === 1) {
                alert('OTP sent successfully!');
                setTimerShow(true);
                setTimeLeft(() => {
                    const fiveMinutesInSeconds = 5 * 60;
                    localStorage.setItem('timeLeft', fiveMinutesInSeconds);
                    return fiveMinutesInSeconds;
                });
            } else {
                alert('OTP send failed, please try again later.');
            }
        } catch (error) {
            alert('Internal server error to sending OTP.');
        }
    };

    const ChangePassword = async () => {
        if (!username || username.trim() === '') {
            alert('Please enter a valid username.');
            return;
        }
        if (!password || password.trim() === '') {
            alert('Please enter a valid password.');
            return;
        }
        if (!confirmPassword || confirmPassword.trim() === '') {
            alert('Please confirm your password.');
            return;
        }
        try {
            const response = await fetch(`${SERVER_SECURE}${SERVER_URL}/api/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, newPassword: confirmPassword, oldPassword: password }),
            });
            const result = await response.json();
            if (result.status === 1) {
                alert('Password change successfully!');
                setShowChangeForm(false);
            } else {
                alert(result.message || 'Failed to send data, please try again later.');
            }
        } catch (error) {
            alert('An error occurred while processing your request. Please try again later.');
        }
    }

    const ChangePasswordCall = () => {
        setShowChangeForm(!showChangeForm);
        setShowSignUpForm(false);
        setShowForgetForm(false);
    }

    const handleBackClick = () => {
        setShowForgetForm(false);
        setShowChangeForm(false);
        setShowSignUpForm(false);
    }

    const SignUp = () => {
        setShowSignUpForm(!showSignUpForm);
        setShowForgetForm(false);
        setShowChangeForm(false);
    }

    const CreateAccount = async () => {
        if (!name || name.trim() === '') {
            alert('Please enter a valid name.');
            return;
        }
        if (!username || username.trim() === '') {
            alert('Please enter a valid username.');
            return;
        }
        if (!password || password.trim() === '') {
            alert('Please enter a valid password.');
            return;
        }
        if (!confirmPassword || confirmPassword.trim() === '') {
            alert('Please confirm your password.');
            return;
        }
        if (!otp || otp.trim() === '') {
            alert('Please enter a valid OTP.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        try {
            const response = await fetch(`${SERVER_SECURE}${SERVER_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password: password, otp: otp, name: name }),
            });
            const result = await response.json();
            if (result.status === 1) {
                alert('Account created successfully!');
                setShowSignUpForm(false);
            } else {
                alert(result.message || 'Failed to send data, please try again later.');
            }
        } catch (error) {
            alert('An error occurred while processing your request. Please try again later.');
        }
    }

    return (
        <>
            <div className="login-container">
                <img className="login-img" width={350} src={LogInImage} alt='Loading...' />
                <h1>Geofencing</h1>
                {(!showForgetForm && !showChangeForm && !showSignUpForm) && (<form onSubmit={handleSubmit} className="login-form">
                    <h2>Login your account</h2>
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
                    <div class="button-container">
                        <button type="submit" class="btn btn-login">Login</button>
                        <button type="button" class="btn btn-forgot" onClick={SignUp}>Sign up</button>
                        <button type="button" class="btn btn-forgot" onClick={ForgetPasswordCall}>Forget Password</button>
                        <button type="button" class="btn btn-forgot" onClick={ChangePasswordCall}>Change Password</button>
                    </div>
                </form>)}
                {showForgetForm && (<form className="login-form">
                    <a href="#" className="back-icon" onClick={handleBackClick}>
                        <IoMdArrowRoundBack size={24} />
                    </a>
                    <h2>Forget your password</h2>
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
                        <label htmlFor="password">New password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Confirm password</label>
                        <input
                            type="password"
                            id="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="number">Enter OTP</label>
                        <input
                            type="number"
                            id="number"
                            value={otp}
                            onChange={(event) => setotp(event.target.value)}
                            required
                        />
                    </div>
                    {timerShow && (
                        <div
                            className="timer"
                            style={{ color: 'red', fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}
                        >
                            {formatTime(timeLeft)}
                        </div>
                    )}
                    <div class="button-container">
                        <button type="button" class="btn btn-forgot" onClick={() => HandleSendotp("1")}>Send otp</button>
                        <button type="button" class="btn btn-login" onClick={handleSubmitFrogetCall}>Forget Password</button>
                    </div>
                </form>)}
                {showChangeForm && (<form className="login-form">
                    <a href="#" className="back-icon" onClick={handleBackClick}>
                        <IoMdArrowRoundBack size={24} />
                    </a>
                    <h2>Change your password</h2>
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
                        <label htmlFor="password">Old password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">New password</label>
                        <input
                            type="password"
                            id="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div class="button-container">
                        <button type="button" class="btn btn-forgot" onClick={ChangePassword}>Change password</button>
                    </div>
                </form>)}
                {showSignUpForm && (<form className="login-form">
                    <a href="#" className="back-icon" onClick={handleBackClick}>
                        <IoMdArrowRoundBack size={24} />
                    </a>
                    <h2>SignUp your account</h2>
                    <div className="form-control">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>
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
                    <div className="form-control">
                        <label htmlFor="password">Confirm password</label>
                        <input
                            type="password"
                            id="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="number">Enter OTP</label>
                        <input
                            type="number"
                            id="number"
                            value={otp}
                            onChange={(event) => setotp(event.target.value)}
                            required
                        />
                    </div>
                    {timerShow && (
                        <div
                            className="timer"
                            style={{ color: 'red', fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}
                        >
                            {formatTime(timeLeft)}
                        </div>
                    )}
                    <div class="button-container">
                        <button type="button" class="btn btn-forgot" onClick={() => HandleSendotp("2")}>Send otp</button>
                        <button type="button" class="btn btn-forgot" onClick={CreateAccount}>Create account</button>
                    </div>
                </form>)}
            </div>
        </>
    );
}
