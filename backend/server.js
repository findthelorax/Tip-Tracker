const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const teamMembersRoutes = require("./routes/teamMembers");
const TeamMember = require("./models/teamMember");
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/teamMembers", teamMembersRoutes);

mongoose.connect("mongodb://localhost:27017/tip-tracker");

app.get("/api/team", async (req, res) => {
    const teamMembers = await TeamMember.find();
    res.json(teamMembers);
});

app.post("/api/team", async (req, res) => {
    const { name, position } = req.body;

    if (!name || !position) {
        return res
            .status(400)
            .json({ error: "Both name and position are required" });
    }

    const newMember = new TeamMember({ name, position });
    await newMember.save();

    res.json(newMember);
});

app.delete("/api/team/:id", async (req, res) => {
    const memberId = req.params.id;
    try {
        // Find and remove the team member by ID
        await TeamMember.findOneAndDelete({ _id: memberId });
        res.json({
            success: true,
            message: "Team member deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message || "Internal Server Error",
        });
    }
});

app.get("/api/listDatabases", async (req, res) => {
    try {
        const admin = mongoose.connection.getClient().db().admin();
        const databaseList = await admin.listDatabases();

        const filteredDatabases = databaseList.databases.filter(
            (db) =>
                db.name !== "admin" &&
                db.name !== "config" &&
                db.name !== "local"
        );

        res.status(200).json({ databases: filteredDatabases });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message || "Internal Server Error",
        });
    }
});

// Assuming you have something like this in your server.js or routes file
app.delete("/api/deleteDatabase/:databaseName", async (req, res) => {
    const { databaseName } = req.params;

    try {
        if (!databaseName) {
            return res.status(400).json({ error: "Invalid database name" });
        }

        await mongoose.connection.db.dropDatabase();

        res.status(200).json({
            message: `Database ${databaseName} deleted successfully`,
        });
    } catch (error) {
        console.error("Error deleting database:", error);
        res.status(500).json({
            error: error.message || "Internal Server Error",
        });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: error.message || "Internal Server Error" });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
