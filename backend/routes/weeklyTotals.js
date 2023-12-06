// weeklyTotalsRoutes.js
const express = require('express');
const router = express.Router();
const TeamMember = require('../models/teamMember');
const WeeklyTotals = require('../models/weeklyTotals');

// Get all weekly totals
router.get('/all', async (req, res) => {
    try {
        const weeklyTotals = await WeeklyTotals.find({});
        res.json(weeklyTotals);
    } catch (error) {
        console.error('Error getting all weekly totals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new weekly total
router.post('/', async (req, res) => {
    try {
        const newWeeklyTotal = new WeeklyTotals(req.body);
        const savedWeeklyTotal = await newWeeklyTotal.save();
        res.json(savedWeeklyTotal);
    } catch (error) {
        console.error('Error creating new weekly total:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete all weekly totals
router.delete('/all', async (req, res) => {
    try {
        await WeeklyTotals.deleteMany({});
        res.json({ message: 'All weekly totals deleted' });
    } catch (error) {
        console.error('Error deleting all weekly totals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;