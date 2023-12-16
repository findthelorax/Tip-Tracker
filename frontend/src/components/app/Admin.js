import React, { useState } from 'react';
import { registerAdmin } from '../utils/api'; // Assuming api.js is in the same directory

function AdminRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await registerAdmin(username, password);
            console.log("🚀 ~ file: Admin.js:13 ~ handleSubmit ~ password:", password)
            console.log("🚀 ~ file: Admin.js:13 ~ handleSubmit ~ username:", username)
            
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <input type="submit" value="Register" />
        </form>
    );
}

export default AdminRegister;