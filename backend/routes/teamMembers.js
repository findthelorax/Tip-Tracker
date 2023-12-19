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

router.get('/:id/weeklyTotals/', TeamMembersController.getAllWeeklyTotals);

router.post('/:id/weeklyTotals/:week', TeamMembersController.createWeeklyTotals);
router.get('/:id/weeklyTotals/:week', TeamMembersController.getWeeklyTotals);
router.delete('/:id/weeklyTotals/:week', TeamMembersController.deleteWeeklyTotals);
router.patch('/:id/weeklyTotals/:week', TeamMembersController.updateWeeklyTotals);

router.put('/:id/updateWeeklyTotals', TeamMembersController.updateWeeklyTotals);

module.exports = router;