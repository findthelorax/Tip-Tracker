import axios from "axios";

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
            `${process.env.REACT_APP_SERVER_URL}/api/teamMembers`
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
            `${process.env.REACT_APP_SERVER_URL}/api/teamMembers`,
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
            `${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${id}`
        );
    } catch (error) {
        console.error(`Error deleting team member: ${error.message}`, error);
        throw error;
    }
};

export const fetchDailyTotalsAll = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/teamMembers`
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
            `${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${teamMemberId}/dailyTotals`,
            dailyTotals
        );
        return response.data;
    } catch (error) {
        console.error(`Error submitting daily totals: ${error.message}`);
        throw error;
    }
};

export const deleteDailyTotalFromServer = async (teamMemberId, dailyTotalId) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${teamMemberId}/dailyTotals/${dailyTotalId}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error deleting daily total: ${error.message}`);
        throw error;
    }
};