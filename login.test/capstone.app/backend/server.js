const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = process.env.PORT;
const frontendPath = path.join(__dirname, '../frontend/build');

mongoose
	.connect('mongodb://localhost:27017/sponsorshipDB')
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use('/users', userRoutes);
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
	res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));