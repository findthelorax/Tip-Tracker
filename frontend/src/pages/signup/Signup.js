import { Button, TextField, InputAdornment, Snackbar, SnackbarContent, IconButton } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { signup } from '../../utils/api';
import { signupStyles } from './SignupStyles';

import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

function Signup() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [hidePassword, setHidePassword] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();

	const handleChange = (setter) => (event) => {
		setter(event.target.value);
	};

	const passwordMatch = () => password === passwordConfirm;

	const showPassword = () => {
		setHidePassword(!hidePassword);
	};

	const isValid = () => {
		return username !== '' && passwordMatch();
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!isValid()) {
			setErrorMessage("Passwords don't match or username is empty");
			return;
		}

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
			let errorMessage = error.response ? error.response.data.error : error.message;
			if (error.response && error.response.data.err.includes('E11000')) {
				errorMessage = 'Username already taken. Please choose another one.';
			}
			setErrorMessage(errorMessage);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextField label="Username" value={username} onChange={handleChange(setUsername)} />
			<TextField
				label="Password"
				type={hidePassword ? 'password' : 'text'}
				value={password}
				onChange={handleChange(setPassword)}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							{hidePassword ? (
								<VisibilityOffTwoToneIcon onClick={showPassword} />
							) : (
								<VisibilityTwoToneIcon onClick={showPassword} />
							)}
						</InputAdornment>
					),
				}}
			/>
			<TextField
				label="Confirm Password"
				type={hidePassword ? 'password' : 'text'}
				value={passwordConfirm}
				onChange={handleChange(setPasswordConfirm)}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							{hidePassword ? (
								<VisibilityOffTwoToneIcon onClick={showPassword} />
							) : (
								<VisibilityTwoToneIcon onClick={showPassword} />
							)}
						</InputAdornment>
					),
				}}
			/>
			<Button type="submit">Signup</Button>
			<Snackbar
				open={!!errorMessage}
				autoHideDuration={6000}
				onClose={() => setErrorMessage('')}
			>
				<SnackbarContent
					message={
						<span>
							<ErrorIcon />
							{errorMessage}
						</span>
					}
					action={
						<IconButton size="small" aria-label="close" color="inherit" onClick={() => setErrorMessage('')}>
							<CloseIcon fontSize="small" />
						</IconButton>
					}
				/>
			</Snackbar>
		</form>
	);
}

export default styled(Signup)(signupStyles);