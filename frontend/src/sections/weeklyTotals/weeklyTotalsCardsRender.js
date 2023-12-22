import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { CiBeerMugFull } from "react-icons/ci";
import { GiHamburger } from "react-icons/gi";
import { success, error } from '../../theme/colors';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography, CircularProgress } from '@mui/material';

function WeeklyBarSalesCardRender({ teamMembers, selectedDate, salesDifferences = { foodSales: { difference: 0, positive: 0 } }, sx }) {
	if (!teamMembers) {
		return <CircularProgress />;
	}
	const weekStart = moment(selectedDate).startOf('week').format('YYYY-MM-DD');
	const totalWeeklyBarSales = teamMembers.reduce((total, member) => {
		const weekTotal = member.weeklyTotals.find(total => total.weekStart === weekStart);
		return total + (weekTotal ? weekTotal.barSales : 0);
	}, 0);

	// const totalWeeklyBarSales = teamMembers.reduce((total, member) => {
	// 	return total + member.weeklyTotals.reduce((sum, weekTotal) => sum + weekTotal.barSales, 0);
	// }, 0);

	const formattedTotalWeeklyBarSales = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		totalWeeklyBarSales
	);

	const startDate = moment(selectedDate).startOf('week').format('MM/DD');
	const endDate = moment(selectedDate).endOf('week').format('MM/DD');

	const difference = salesDifferences.barSales?.difference || 0;
	const positive = salesDifferences.barSales?.positive || 0;
	const formattedDifference = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(difference);

	return (
		<Card sx={{ ...sx, backgroundColor: 'background.paper' }}>
			<CardContent>
				<Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline">
							Total Bar Sales {startDate} - {endDate}
						</Typography>
						<Typography variant="h4">{formattedTotalWeeklyBarSales}</Typography>
					</Stack>
					<Avatar sx={{ ...sx, height: 56, width: 56 }}>
						<SvgIcon fontSize="medium">
							<CiBeerMugFull />
						</SvgIcon>
					</Avatar>
				</Stack>
				{formattedDifference && (
					<Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
						<Stack alignItems="center" direction="row" spacing={0.5}>
							<SvgIcon color={positive ? 'success' : 'error'} fontSize="small">
								{positive ? <FaArrowUp /> : <FaArrowDown />}
							</SvgIcon>
							<Typography color={positive ? success.main : error.main} variant="body2">
								{formattedDifference}%
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
    salesDifferences: PropTypes.shape({
        barSales: PropTypes.object,
    }),
    selectedDate: PropTypes.object.isRequired,
    sx: PropTypes.object,
};

function WeeklyFoodSalesCardRender({ teamMembers, selectedDate, salesDifferences = { foodSales: { difference: 0, positive: 0 } }, sx }) {
	if (!teamMembers) {
		return <CircularProgress />;
	}

	const weekStart = moment(selectedDate).startOf('week').format('YYYY-MM-DD');
	const totalWeeklyFoodSales = teamMembers.reduce((total, member) => {
		const weekTotal = member.weeklyTotals.find(total => total.weekStart === weekStart);
		return total + (weekTotal ? weekTotal.foodSales : 0);
	}, 0);

	const formattedTotalWeeklyFoodSales = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		totalWeeklyFoodSales
	);

	const difference = salesDifferences.foodSales?.difference || 0;
	const positive = salesDifferences.foodSales?.positive || 0;
	const formattedDifference = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(difference);

	const startDate = moment(selectedDate).startOf('week').format('MM/DD');
	const endDate = moment(selectedDate).endOf('week').format('MM/DD');

	return (
		<Card sx={{ ...sx, backgroundColor: 'background.paper' }}>
			<CardContent>
				<Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline">
							Total Food Sales {startDate} - {endDate}
						</Typography>
						<Typography variant="h4">{formattedTotalWeeklyFoodSales}</Typography>
					</Stack>
					<Avatar sx={{ ...sx, height: 56, width: 56 }}>
						<SvgIcon fontSize="medium">
							<GiHamburger />
						</SvgIcon>
					</Avatar>
				</Stack>
				{formattedDifference && (
					<Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
						<Stack alignItems="center" direction="row" spacing={0.5}>
							<SvgIcon color={positive ? 'success' : 'error'} fontSize="small">
								{positive ? <FaArrowUp /> : <FaArrowDown />}
							</SvgIcon>
							<Typography color={positive ? success.main : error.main} variant="body2">
								{formattedDifference}%
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

WeeklyFoodSalesCardRender.propTypes = {
    teamMembers: PropTypes.array.isRequired,
    selectedDate: PropTypes.object.isRequired,
    sx: PropTypes.object,
    salesDifferences: PropTypes.shape({
        foodSales: PropTypes.object,
    }),
};

export { WeeklyBarSalesCardRender, WeeklyFoodSalesCardRender };