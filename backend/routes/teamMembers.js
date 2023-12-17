const express = require('express');
const router = express.Router();
const TeamMembersController = require('../controllers/TeamMembersController');

router.get('/', TeamMembersController.getTeamMembers);
router.post("/", TeamMembersController.createTeamMember);
router.get('/:id', TeamMembersController.getTeamMember);

router.put('/:id', TeamMembersController.updateTeamMember);

router.delete('/:id', TeamMembersController.deleteTeamMember);
router.get('/:id/dailyTotals', TeamMembersController.getDailyTotals);
router.post('/:id/dailyTotals', TeamMembersController.createDailyTotal);
router.delete('/:id/dailyTotals/:date', TeamMembersController.deleteDailyTotal);

router.get('/:id/weeklyTotals', TeamMembersController.getWeeklyTotals);
router.post('/:id/weeklyTotals', TeamMembersController.createWeeklyTotals);
router.delete('/:id/weeklyTotals', TeamMembersController.deleteWeeklyTotals);

router.get('/weeklyTotalsAll', TeamMembersController.getWeeklyTotalsAll);

module.exports = router;