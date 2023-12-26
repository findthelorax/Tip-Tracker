import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TeamContext } from '../../contexts/TeamContext';
import { FaArrowUp, FaArrowDown, FaWhiskeyGlass, FaUtensils } from 'react-icons/fa6';
import { CiBeerMugFull } from 'react-icons/ci';
import { GiHamburger } from 'react-icons/gi';
import { success, error } from '../../theme/colors';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography, CircularProgress } from '@mui/material';

function WeeklyFoodSalesCardRender({ selectedDate, salesDifferences, sx, totalWeeklyFoodSales }) {
	console.log('🚀 ~ file: weeklyTotalsCardsRender.js:92 ~ salesDifferences:', salesDifferences);
	const { team } = useContext(TeamContext);
	if (!team) {
		return <CircularProgress />;
	}

	// const weekStart = moment(selectedDate).startOf('week').format('YYYY-MM-DD');
	// const totalWeeklyFoodSales = team.reduce((total, member) => {
	// 	const weekTotal = member.weeklyTotals.find((total) => total.weekStart === weekStart);
	// 	return total + (weekTotal ? weekTotal.foodSales : 0);
	// }, 0);

	const formattedTotalWeeklyFoodSales = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		totalWeeklyFoodSales
	);

	const difference = salesDifferences.foodSales?.difference || 0;
	const positive = salesDifferences.foodSales?.positive || 0;
	const formattedDifference = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		difference
	);

	const startDate = moment(selectedDate).startOf('week').format('MM/DD');
	const endDate = moment(selectedDate).endOf('week').format('MM/DD');

	return (
		<Card sx={{ ...sx, width: '300px', backgroundColor: 'background.paper' }}>
			{' '}
			<CardContent>
				<Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline" noWrap>
							Food Sales {startDate} - {endDate}
						</Typography>
						<Typography variant="h5">{formattedTotalWeeklyFoodSales}</Typography>
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
							<SvgIcon
								color={difference === 0 ? 'disabled' : positive ? success : error}
								fontSize="small"
							>
								{difference === 0 ? <FaUtensils /> : positive ? <FaArrowUp /> : <FaArrowDown />}
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
	selectedDate: PropTypes.object.isRequired,
	sx: PropTypes.object,
	salesDifferences: PropTypes.shape({
		foodSales: PropTypes.object,
	}),
};
function WeeklyBarSalesCardRender({
	selectedDate,
	salesDifferences = { barSales: { difference: 0, positive: 0 } },
	sx,
	totalWeeklyBarSales,
}) {
	const { team } = useContext(TeamContext);
	console.log("🚀 ~ file: weeklyTotalsCardsRender.js:16 ~ salesDifferences:", salesDifferences)
	if (!team) {
		return <CircularProgress />;
	}
	const weekStart = moment(selectedDate).startOf('week').format('YYYY-MM-DD');
	const totalWeekBarSales = team.reduce((total, member) => {
		const weekTotal = member.weeklyTotals.find((total) => total.weekStart === weekStart);
		return total + (weekTotal ? weekTotal.barSales : 0);
	}, 0);
	console.log(
		'🚀 ~ file: weeklyTotalsCardsRender.js:104 ~ totalWeekBarSales ~ totalWeekBarSales:',
		totalWeekBarSales
	);

	const formattedTotalWeeklyBarSales = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		totalWeeklyBarSales
	);

	const startDate = moment(selectedDate).startOf('week').format('MM/DD');
	const endDate = moment(selectedDate).endOf('week').format('MM/DD');

	const difference = salesDifferences.barSales?.difference || 0;
	const positive = salesDifferences.barSales?.positive || 0;
	const formattedDifference = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		difference
	);

	return (
		<Card sx={{ ...sx, width: '300px', backgroundColor: 'background.paper' }}>
			{' '}
			<CardContent>
				<Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline" noWrap sx={{ mt: 0 }}>
							Bar Sales {startDate} - {endDate}
						</Typography>
						<Typography variant="h5">{formattedTotalWeeklyBarSales}</Typography>
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
							<SvgIcon
								color={difference === 0 ? 'disabled' : 'positive' ? 'success' : 'error'}
								fontSize="small"
							>
								{difference === 0 ? <FaWhiskeyGlass /> : positive ? <FaArrowUp /> : <FaArrowDown />}
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
	selectedDate: PropTypes.object.isRequired,
	sx: PropTypes.object,
	salesDifferences: PropTypes.shape({
		barSales: PropTypes.object,
	}),
};

export { WeeklyBarSalesCardRender, WeeklyFoodSalesCardRender };
