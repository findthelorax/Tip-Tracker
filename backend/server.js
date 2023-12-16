const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const teamMembersRoutes = require('./routes/teamMembers');
const databaseRoutes = require('./routes/database');
const loginRoutes = require('./routes/login');
const userRoutes = require('./routes/users.js');
require('dotenv').config();

const app = express();
const backendPort = process.env.BACKEND_PORT;
const frontendPort = process.env.FRONTEND_PORT;
const ip = process.env.IP;

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error(err));

app.use(
	cors({
		origin: `${ip}:${frontendPort}`, // replace with the origin of the client
		credentials: true,
	})
);
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false }, // set to true if your using https
	})
);
app.use('/teamMembers', teamMembersRoutes);
app.use('/api', databaseRoutes);
app.use('/', loginRoutes);
app.use('/users', userRoutes);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: error.message || 'Internal Server Error' });
});
app.listen(backendPort, () => {
	console.log(`Server is running on ${ip}:${backendPort}`);
});
