import axios from 'axios';

// Auth
export const signup = async (username, password, role) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_SERVER_URL}/signup`,
			{ username, password, role },
			{ withCredentials: true }
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// export const login = async (username, password) => {
// 	try {
// 		const response = await axios.post(
// 			`${process.env.REACT_APP_SERVER_URL}/login`,
// 			{ username, password },
// 			{ withCredentials: true }
// 		);
// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };

export async function login(username, password) {
	const response = await axios.post('/login', { username, password });

	// Set the token in the Authorization header for future requests
	axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

	// Assuming the server includes the role in the response
	const { role } = response.data;

	// Set the role in local storage for future reference
	localStorage.setItem('userRole', role);
	console.log("🚀 ~ file: api.js:41 ~ login ~ role:", role)

	return response.data;
}

// Logout
export const logout = async () => {
	try {
		const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/logout`, {}, { withCredentials: true });
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Users

// Add a user
export const addUser = async (username, password) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_SERVER_URL}/users`,
			{ username, password },
			{ withCredentials: true }
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Fetch a user
export const fetchUser = async (userId) => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/${userId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Delete a user
export const deleteUser = async (userId) => {
	try {
		await axios.delete(`${process.env.REACT_APP_SERVER_URL}/users/${userId}`);
	} catch (error) {
		throw error;
	}
};

// Update a user
export const updateUser = async (userId, updates) => {
	try {
		const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/users/${userId}`, updates);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Fetch all users
export const fetchUsers = async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/users`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Admins

// Admin registration
export const registerAdmin = async (username, password) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_SERVER_URL}/admin/register`,
			{ username, password },
			{ withCredentials: true }
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Add an admin
export const addAdmin = async (username, password) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_SERVER_URL}/admins`,
			{ username, password },
			{ withCredentials: true }
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Fetch an admin
export const fetchAdmin = async (adminId) => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/admins/${adminId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Delete an admin
export const deleteAdmin = async (adminId) => {
	try {
		await axios.delete(`${process.env.REACT_APP_SERVER_URL}/admins/${adminId}`);
	} catch (error) {
		throw error;
	}
};

// Fetch all admins
export const fetchAdmins = async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/admins`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Update an admin
export const updateAdmin = async (adminId, updates) => {
	try {
		const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/admins/${adminId}`, updates);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Profile
export const fetchProfile = async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/profile`, { withCredentials: true });

		if (response.status === 200) {
			return response.data;
		} else if (response.status === 401) {
			// Redirect to login page
			window.location.href = '/login';
		} else {
			throw new Error('An error occurred while fetching the profile.');
		}
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

export const updateProfile = async (profileData) => {
	try {
		const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/profile`, profileData, {
			withCredentials: true,
		});

		if (response.status === 200) {
			return response.data;
		} else if (response.status === 401) {
			// Redirect to login page
			window.location.href = '/login';
		} else {
			throw new Error('An error occurred while updating the profile.');
		}
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

// Databsase
export const addDatabase = async (databaseName) => {
	try {
		const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/addDatabase`, {
			name: databaseName,
		});
		return response.data;
	} catch (error) {
		console.error(`Error adding database: ${error.message}`, error);
		throw error;
	}
};

export const getDatabases = async () => {
	const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/getDatabases`);
	return response.data.databases;
};

export const deleteDatabase = async (databaseName) => {
	await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/deleteDatabase/${databaseName}`);
};

// Team Members
export const getTeamMembers = async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/teamMembers`);
		return response.data;
	} catch (error) {
		console.error('Error fetching team members:', error);
		throw error;
	}
};

export const addTeamMember = async (teamMemberName, position) => {
	try {
		const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/teamMembers`, {
			teamMemberName,
			position,
		});
		return response.data;
	} catch (error) {
		console.error(`Error adding team member: ${error.message}`, error);
		throw error;
	}
};

export const deleteTeamMember = async (id) => {
	try {
		await axios.delete(`${process.env.REACT_APP_SERVER_URL}/teamMembers/${id}`);
	} catch (error) {
		console.error(`Error deleting team member: ${error.message}`, error);
		throw error;
	}
};

// Daily Totals
export const getAllDailyTotals = async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/teamMembers/allDailyTotals`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching daily totals: ${error.message}`);
		throw error;
	}
};

export const submitDailyTotalToServer = async (teamMemberId, dailyTotals) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_SERVER_URL}/teamMembers/${teamMemberId}/dailyTotals`,
			dailyTotals
		);
		return response.data;
	} catch (error) {
		console.error(`Error submitting daily totals: ${error.message}`);
		throw error;
	}
};

export const deleteDailyTotalFromServer = async (teamMemberId, dateId) => {
	try {
		const response = await axios.delete(
			`${process.env.REACT_APP_SERVER_URL}/teamMembers/${teamMemberId}/dailyTotals/${dateId}`
		);
		return response.data;
	} catch (error) {
		console.error(`Error deleting daily total: ${error.message}`);
		throw error;
	}
};

// Weekly Totals
export const getWeeklyTotal = async (teamMemberId, week) => {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_SERVER_URL}/teamMembers/${teamMemberId}/weeklyTotals/${week}`
		);
		return response.data;
	} catch (error) {
		console.error(`Error getting weekly total: ${error.message}`);
		throw error;
	}
};

export const getAllWeeklyTotals = async () => {
	try {
		const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/teamMembers/allWeeklyTotals`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching daily totals: ${error.message}`);
		throw error;
	}
};

export const createWeeklyTotal = async (teamMemberId, weeklyTotal) => {
	try {
		const response = await axios.post(
			`${process.env.REACT_APP_SERVER_URL}/teamMembers/${teamMemberId}/weeklyTotals`,
			weeklyTotal
		);
		return response.data;
	} catch (error) {
		console.error(`Error creating weekly total: ${error.message}`);
		throw error;
	}
};

export const deleteWeeklyTotal = async (teamMemberId, week) => {
	try {
		const response = await axios.delete(
			`${process.env.REACT_APP_SERVER_URL}/teamMembers/${teamMemberId}/weeklyTotals/${week}`
		);
		return response.data;
	} catch (error) {
		console.error(`Error deleting weekly total: ${error.message}`);
		throw error;
	}
};

export const updateWeeklyTotal = async (teamMemberId, week, updatedWeeklyTotal) => {
	try {
		const response = await axios.patch(
			`${process.env.REACT_APP_SERVER_URL}/teamMembers/${teamMemberId}/weeklyTotals/${week}`,
			updatedWeeklyTotal
		);
		return response.data;
	} catch (error) {
		console.error(`Error updating weekly total: ${error.message}`);
		throw error;
	}
};

export const updateWeeklyTotals = async (teamMemberId, dailyTotals) => {
	try {
		const response = await axios.put(
			`${process.env.REACT_APP_SERVER_URL}/teamMembers/${teamMemberId}/weeklyTotals`,
			dailyTotals,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};
