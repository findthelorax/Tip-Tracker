import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();

	const handleSignup = () => {
		navigate('/signup');
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const data = await login(username, password);
			if (data.message === 'Login successful') {
				
				// Store the JWT token in local storage
				localStorage.setItem('jwtToken', data.token);

				// Navigate to a different page based on the user's role
				if (data.role === 'user') {
					navigate('/user-dashboard');
				} else if (data.role === 'admin') {
					navigate('/admin-dashboard');
				} else if (data.role === 'root') {
					navigate('/root-dashboard');
				} else {
					navigate('/dashboard');
				}
			}
		} catch (error) {
			console.error('Error logging in:', error);
			// Check if response is available before trying to access response.data.error
			const errorMessage = error.response ? error.response.data.error : error.message;
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
			<Button type="submit">Login</Button>
			<Button onClick={handleSignup}>Go to Signup</Button>
			{errorMessage && <p>{errorMessage}</p>}
		</form>
	);
}

export default Login;
