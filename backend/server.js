const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const teamMembersRoutes = require('./routes/teamMembers');
const weeklyTotalsRoutes = require('./routes/weeklyTotals');
const databaseRoutes = require('./routes/database');
const loginRoutes = require('./routes/login');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/teamMembers', teamMembersRoutes);
app.use('/api/weeklyTotals', weeklyTotalsRoutes);
app.use('/api', databaseRoutes);
app.use('/api', loginRoutes);

mongoose.connect(process.env.DB_URL);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: error.message || 'Internal Server Error' });
});
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});