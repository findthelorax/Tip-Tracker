const express = require('express');
const router = express.Router();
const TeamMembersController = require('../controllers/TeamMembersController');

router.get('/:teamMemberId', TeamMembersController.getTeamMember);
router.post("/", TeamMembersController.createTeamMember);
router.put('/:teamMemberId', TeamMembersController.updateTeamMember);
router.delete('/:teamMemberId', TeamMembersController.deleteTeamMember);

router.get('/', TeamMembersController.getTeamMembers);

router.get('/:teamMemberId/dailyTotals', TeamMembersController.getDailyTotals);
router.post('/:teamMemberId/dailyTotals', TeamMembersController.createDailyTotal);
router.delete('/:teamMemberId/dailyTotals/:dailyTotalId', TeamMembersController.deleteDailyTotal);

router.get('/:teamMemberId/weeklyTotals/', TeamMembersController.getOneTMWeeklyTotals);

router.get('/:teamMemberId/weeklyTotals/:week', TeamMembersController.getOneWeeklyTotals);
router.post('/:teamMemberId/weeklyTotals/:week', TeamMembersController.createWeeklyTotals);
router.delete('/:teamMemberId/weeklyTotals/:week', TeamMembersController.deleteWeeklyTotals);

router.put('/:teamMemberId/updateWeeklyTotals', TeamMembersController.updateWeeklyTotalsPut);
router.patch('/:teamMemberId/weeklyTotals/:week', TeamMembersController.updateWeeklyTotalsPatch);

module.exports = router;