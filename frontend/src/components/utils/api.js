import axios from "axios";

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

export const login = async (username, password) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/login`,
            { username, password },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

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

export const addDatabase = async (databaseName) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/addDatabase`,
            { name: databaseName }
        );
        return response.data;
    } catch (error) {
        console.error(`Error adding database: ${error.message}`, error);
        throw error;
    }
};

export const getDatabases = async () => {
    const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/getDatabases`
    );
    return response.data.databases;
};

export const deleteDatabase = async (databaseName) => {
    await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/deleteDatabase/${databaseName}`
    );
};

export const getTeamMembers = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/teamMembers`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching team members:', error);
        throw error;
    }
};

export const addTeamMember = async (teamMemberName, position) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/teamMembers`,
            { teamMemberName, position }
        );
        return response.data;
    } catch (error) {
        console.error(`Error adding team member: ${error.message}`, error);
        throw error;
    }
};

export const deleteTeamMember = async (id) => {
    try {
        await axios.delete(
            `${process.env.REACT_APP_SERVER_URL}/teamMembers/${id}`
        );
    } catch (error) {
        console.error(`Error deleting team member: ${error.message}`, error);
        throw error;
    }
};

export const fetchDailyTotalsAll = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/teamMembers`
        );
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

export const deleteDailyTotalFromServer = async (teamMemberId, date) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_SERVER_URL}/teamMembers/${teamMemberId}/dailyTotals/${date}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error deleting daily total: ${error.message}`);
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
        const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/users/${userId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a user
export const deleteUser = async (userId) => {
    try {
        await axios.delete(
            `${process.env.REACT_APP_SERVER_URL}/users/${userId}`
        );
    } catch (error) {
        throw error;
    }
};