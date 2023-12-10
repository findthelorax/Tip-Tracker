import React, { useState } from 'react';
import axios from 'axios'; // Make sure to install axios with npm install axios


function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        setError(null); // Clear any previous error

        try {
            const loginResponse = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/login`,
                {
                    username, // this should be the username entered by the user
                    password, // this should be the password entered by the user
                }
            );

            if (response.ok) {
                const token = loginResponse.data.token;
                // Save the token somewhere (e.g., in local storage)
                localStorage.setItem('token', token);
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('An error occurred: ' + error.toString());
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginScreen;