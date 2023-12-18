import React, { useEffect, useState } from 'react';

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/profile', { credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401) {
                    setError('Please log in to view your profile.');
                    throw new Error('Not authenticated');
                } else {
                    setError('An error occurred while fetching your profile.');
                    throw new Error('Error fetching profile');
                }
            })
            .then(userData => {
                setUser(userData);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>Username: {user.username}</p>
            {/* Display other user data as needed */}
        </div>
    );
}

export default Profile;