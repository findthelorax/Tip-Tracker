const mongoose = require('mongoose');
const TeamMember = require('./teamMember');
const User = require('./users');
require('dotenv').config();

const db = mongoose.createConnection(process.env.MONGODB_URL);

// Then, when defining your models, you can specify which connection to use
const UserModel = db.model('User', User.schema, 'users'); // specify the collection name
const TeamModel = db.model('TeamMember', TeamMember.schema, 'teamMembers'); // specify the collection name

module.exports = { User: UserModel, Team: TeamModel };