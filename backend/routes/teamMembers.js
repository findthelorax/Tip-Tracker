const express = require('express');
const router = express.Router();
const TeamMembersController = require('../controllers/TeamMembersController');

router.get('/:id', TeamMembersController.getTeamMember);
router.post("/", TeamMembersController.createTeamMember);
router.put('/:id', TeamMembersController.updateTeamMember);
router.delete('/:id', TeamMembersController.deleteTeamMember);

router.get('/', TeamMembersController.getTeamMembers);

router.get('/:id/dailyTotals', TeamMembersController.getDailyTotals);
router.post('/:id/dailyTotals', TeamMembersController.createDailyTotal);
router.delete('/:id/dailyTotals/:date', TeamMembersController.deleteDailyTotal);

router.get('/:id/weeklyTotals/', TeamMembersController.getOneTMWeeklyTotals);

router.get('/:id/weeklyTotals/:week', TeamMembersController.getOneWeeklyTotals);
router.post('/:id/weeklyTotals/:week', TeamMembersController.createWeeklyTotals);
router.delete('/:id/weeklyTotals/:week', TeamMembersController.deleteWeeklyTotals);

router.put('/:id/updateWeeklyTotals', TeamMembersController.updateWeeklyTotalsPut);
router.patch('/:id/weeklyTotals/:week', TeamMembersController.updateWeeklyTotalsPatch);

module.exports = router;