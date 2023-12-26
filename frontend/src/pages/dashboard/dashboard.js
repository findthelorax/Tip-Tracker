import React, { useState } from 'react';
import { Grid, Container, Box, Typography, Stack, Button } from '@mui/material';
import TeamMembersList from '../../components/teamMembers/teamMembersList';
import TeamMemberForm from '../../components/teamMembers/teamMemberForm';
import { WeeklyTotalsTable } from '../../components/weeklyTotals/weeklyTotalsTable';
import { WeeklyTipsTable } from '../../components/weeklyTotals/weeklyTipsTable';
import { WeeklyFoodSalesCard, WeeklyBarSalesCard } from '../../components/weeklyTotals/weeklyTotalsCards';
import { DailyBarSalesCard, DailyFoodSalesCard } from '../../components/dailyTotals/dailyTotalsCards';
import DailyTotalsTable from '../../components/dailyTotals/dailyTotalsTable';
import DailyTotalsForm from '../../components/dailyTotals/dailyTotalsForm';
import { TeamContext } from '../../contexts/TeamContext';
import TimePeriodTable from '../../components/salesTables/timePeriodTables';
import moment from 'moment';

function Dashboard() {
	const [weeklyDifferences] = useState({});
	const [dailyDifferences] = useState({});
	const { team } = React.useContext(TeamContext);
	const [selectedDate, setSelectedDate] = useState(moment());
	const [timePeriod, setTimePeriod] = useState('day');

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			{/* row 1 */}
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<WeeklyFoodSalesCard team={team} selectedDate={selectedDate} weeklyDifferences={weeklyDifferences} />
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<WeeklyBarSalesCard team={team} selectedDate={selectedDate} weeklyDifferences={weeklyDifferences} />
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<DailyFoodSalesCard team={team} selectedDate={selectedDate} dailyDifferences={dailyDifferences} />
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<DailyBarSalesCard selectedDate={selectedDate} dailyDifferences={dailyDifferences} />
			</Grid>

			<Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

			{/* row 2 */}
			<Grid item xs={12} md={7} lg={8}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">Daily Totals</Typography>
					</Grid>
					<Grid item>
						<Stack direction="row" alignItems="center" spacing={0}>
							<Button size="small" onClick={() => setTimePeriod('day')}>
								Day
							</Button>
							<Button size="small" onClick={() => setTimePeriod('week')}>
								Week
							</Button>
							<Button size="small" onClick={() => setTimePeriod('month')}>
								Month
							</Button>
						</Stack>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<TimePeriodTable timePeriod={timePeriod} />
				</Grid>
			</Grid>
			<Box sx={{ pt: 1, pr: 2 }}>
				<Grid item xs={12}>
					<DailyTotalsTable />
				</Grid>
			</Box>
		</Grid>

		// <Box
		//     component="main"
		//     sx={{
		//         flexGrow: 1,
		//         py: 8,
		//     }}
		// >
		//     <Container maxWidth="xl">
		//         <Grid container spacing={3}>
		//             <Grid item xs={4} md={6} lg={6}>
		//                 <TeamMemberForm />
		//             </Grid>
		//             <Grid item xs={4} md={6} lg={6}>
		//                 <TeamMembersList />
		//             </Grid>
		//             <Grid item xs={4} md={6} lg={6}>
		//                 <DailyTotalsForm refresh={refresh} />
		//             </Grid>
		//             <Grid item xs={12}>
		//                 <DailyTotalsTable refresh={refresh} />
		//             </Grid>
		//             <Grid item xs={6}>
		//                 <WeeklyFoodSalesCard
		//                     team={team}
		//                     refresh={refresh}
		//                     selectedDate={selectedDate}
		//                     weeklyDifferences={weeklyDifferences}
		//                 />
		//             </Grid>
		//             <Grid item xs={6}>
		//                 <WeeklyBarSalesCard
		//                     team={team}
		//                     refresh={refresh}
		//                     selectedDate={selectedDate}
		//                     weeklyDifferences={weeklyDifferences}
		//                 />
		//             </Grid>
		//             <Grid item xs={6}>
		//                 <DailyFoodSalesCard
		//                     team={team}
		//                     refresh={refresh}
		//                     selectedDate={selectedDate}
		//                     dailyDifferences={dailyDifferences}
		//                 />
		//             </Grid>
		//             <Grid item xs={12} sm={6} md={4} lg={3}>
		//                 <DailyBarSalesCard
		//                     refresh={refresh}
		//                     selectedDate={selectedDate}
		//                     dailyDifferences={dailyDifferences}
		//                 />
		//             </Grid>
		//             <Grid item xs={12}>
		//                 <WeeklyTotalsTable
		//                     team={team}
		//                     refresh={refresh}
		//                     selectedDate={selectedDate}
		//                     setSelectedDate={setSelectedDate}
		//                 />
		//             </Grid>
		//             <Grid item xs={12}>
		//                 <WeeklyTipsTable
		//                     team={team}
		//                     refresh={refresh}
		//                     selectedDate={selectedDate}
		//                     setSelectedDate={setSelectedDate}
		//                 />
		//             </Grid>
		//         </Grid>
		//     </Container>
		// </Box>
	);
}

export default Dashboard;
