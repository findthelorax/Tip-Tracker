import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../utils/api';

function Signup() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(`Username: ${username}`);
		console.log(`Password: ${password}`);
		try {
			const data = await signup(username, password);
			if (data.message === 'Signup successful!') {
				setUsername('');
				setPassword('');
				navigate('/login');
			} else {
				setErrorMessage(data.error);
			}
		} catch (error) {
			console.error('Error logging in:', error);
			// Check if response is available before trying to access response.data.error
			let errorMessage = error.response ? error.response.data.error : error.message;
			// Check if the error is a duplicate key error
			if (error.response && error.response.data.err.includes('E11000')) {
				errorMessage = 'Username already taken. Please choose another one.';
			}
			setErrorMessage(errorMessage);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
			<TextField
				label="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Button type="submit">Signup</Button>
			{errorMessage && <p>{errorMessage}</p>}
		</form>
	);
}

export default Signup;
