const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const teamMembersRoutes = require('./routes/teamMembers');
const databaseRoutes = require('./routes/database');
const loginRoutes = require('./routes/login');
const signupRoutes = require('./routes/signup');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const session = require('express-session');
const passport = require('passport');

require('dotenv').config();

const app = express();
const backendPort = process.env.BACKEND_PORT;
const frontendPort = process.env.FRONTEND_PORT;
const ip = process.env.IP;

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error(err));

app.use(session({ secret: 'lucifer', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: `${ip}:${frontendPort}`, // replace with the origin of the client
		credentials: true,
	})
);
app.use(express.json());
app.use('/teamMembers', teamMembersRoutes);
app.use('/api', databaseRoutes);
app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: error.message || 'Internal Server Error' });
});
app.listen(backendPort, () => {
	console.log(`Server is running on ${ip}:${backendPort}`);
});
