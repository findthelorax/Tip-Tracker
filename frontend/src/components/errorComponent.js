import React from 'react';

const ErrorComponent = ({ error }) => {
    if (!error) {
        return null;
    }

    return (
        <div className="error">
            <h2>Error</h2>
            <p>{error.toString()}</p>
        </div>
    );
};

export default ErrorComponent;