import PropTypes from 'prop-types';
import moment from 'moment';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography, CircularProgress } from '@mui/material';

function WeeklyBarSalesCardRender({ teamMembers, difference, positive = false, selectedDate, sx }) {
	if (!teamMembers) {
		return <CircularProgress />;
	}

	const totalWeeklyBarSales = teamMembers.reduce((total, member) => {
		return total + member.weeklyTotals.reduce((sum, dayTotal) => sum + dayTotal.barSales, 0);
	}, 0);

	const formattedTotalWeeklyBarSales = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		totalWeeklyBarSales
	);

	const startDate = moment(selectedDate).startOf('week').format('MM/DD');
	const endDate = moment(selectedDate).endOf('week').format('MM/DD');

	return (
		<Card sx={sx}>
			<CardContent>
				<Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline">
							Total Weekly Bar Sales ({startDate} - {endDate})
						</Typography>
						<Typography variant="h4">{formattedTotalWeeklyBarSales}</Typography>
					</Stack>
					<Avatar
						sx={{
							backgroundColor: 'error.main',
							height: 56,
							width: 56,
						}}
					>
						<SvgIcon>
							<CurrencyDollarIcon />
						</SvgIcon>
					</Avatar>
				</Stack>
				{difference && (
					<Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
						<Stack alignItems="center" direction="row" spacing={0.5}>
							<SvgIcon color={positive ? 'success' : 'error'} fontSize="small">
								{positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
							</SvgIcon>
							<Typography color={positive ? 'success.main' : 'error.main'} variant="body2">
								{difference}%
							</Typography>
						</Stack>
						<Typography color="text.secondary" variant="caption">
							Since last week
						</Typography>
					</Stack>
				)}
			</CardContent>
		</Card>
	);
}

WeeklyBarSalesCardRender.propTypes = {
	teamMembers: PropTypes.array.isRequired,
	difference: PropTypes.number,
	positive: PropTypes.bool,
	selectedDate: PropTypes.string.isRequired,
	sx: PropTypes.object,
};

export default WeeklyBarSalesCardRender;
