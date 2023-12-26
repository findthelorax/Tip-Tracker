import React from 'react';
import moment from 'moment';

function Footer() {
    const year = moment().year();

    return (
        <footer style={{ backgroundColor: '#f8f9fa', padding: '10px', position: 'fixed', bottom: '0', width: '100%' }}>
            <p>Copyright &copy; {year} Your Company Name</p>
        </footer>
    );
}

export default Footer;