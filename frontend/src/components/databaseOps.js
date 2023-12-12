import React, { useState, useEffect, useContext, useCallback } from "react";
import { ErrorContext } from './contexts/ErrorContext';
import { TeamContext } from './contexts/TeamContext';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { getDatabases, deleteDatabase } from './api';

function DatabaseOperations() {
    const [databases, setDatabases] = useState([]);
    const { error, setError } = useContext(ErrorContext);
    const { setRefreshTeamMembers } = useContext(TeamContext);
    const { setRefreshDailyTotals } = useContext(DailyTotalsContext);
    const [ isShown, setIsShown ] = useState(false);
    

    const fetchDatabases = useCallback(async () => {
        try {
            const response = await getDatabases();
            setDatabases(response);
        } catch (error) {
            setError(error.message);
        }
    }, [setError]);

    useEffect(() => {
        fetchDatabases();
    }, [fetchDatabases]);

    const handleDeleteDatabase = async (databaseName) => {
        const confirmation = window.confirm(
            `ARE YOU SURE YOU WANT TO DELETE:\n\n${databaseName.toUpperCase()}?`
        );
        if (!confirmation) {
            return;
        }

        try {
            await deleteDatabase(databaseName);
            setDatabases((prevDatabases) =>
                prevDatabases.filter((database) => database.name !== databaseName)
            );
            setRefreshDailyTotals((prev) => !prev);
            setRefreshTeamMembers((prev) => !prev);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleListDatabases = () => {
        setIsShown(!isShown);
        if (!isShown) {
            fetchDatabases();
        }
    };

    return (
        <div className="databases-card">
            {error && <p>{error}</p>}
            <h2>Databases</h2>
            <button onClick={handleListDatabases}>
                {isShown ? 'Hide Databases' : 'List Databases'}
            </button>
            {isShown && databases.length > 0 && (
                <div className="databases-table">
                    <div className="database-header">
                        <div>Database Name</div>
                        <div>Action</div>
                    </div>
                    {databases.map((database) => (
                        <div key={database.name} className="database-row">
                            <div>{database.name}</div>
                            <div>
                                <button
                                    onClick={() =>
                                        handleDeleteDatabase(database.name)
                                    }
                                >
                                    Delete Database
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DatabaseOperations;