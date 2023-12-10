import React, { useContext } from 'react';
import { ErrorContext } from './ErrorContext';

function ErrorComponent() {
    const { error } = useContext(ErrorContext);

    if (!error) {
        return null;
    }

    return (
        <div className="error">
            {error}
        </div>
    );
}

export default ErrorComponent;