import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa6';
import { CiBeerMugFull } from 'react-icons/ci';
import { GiHamburger } from 'react-icons/gi';
import { success, error } from '../../theme/colors';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography, CircularProgress } from '@mui/material';

export function DailyBarSalesCardRender({
	totalBarSales,
	selectedDate,
	salesDifferences = { barSales: { difference: 0, positive: 0 } },
	sx,
}) {
	if (totalBarSales === undefined) {
		return <CircularProgress />;
	}

	const formattedTotalBarSales = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		totalBarSales
	);

	const difference = salesDifferences.barSales?.difference || 0;
	const positive = salesDifferences.barSales?.positive || 0;
	const formattedDifference = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		difference
	);

	const formattedDate = moment(selectedDate).format('MM/DD');

	return (
		<Card sx={{ ...sx, backgroundColor: 'background.paper' }}>
			<CardContent>
				<Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline">
							Total Bar Sales {formattedDate}
						</Typography>
						<Typography variant="h4">{formattedTotalBarSales}</Typography>
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
							Since yesterday
						</Typography>
					</Stack>
				)}
			</CardContent>
		</Card>
	);
}

DailyBarSalesCardRender.propTypes = {
	totalBarSales: PropTypes.number,
	salesDifferences: PropTypes.shape({
		barSales: PropTypes.object,
	}),
	selectedDate: PropTypes.object.isRequired,
	sx: PropTypes.object,
};

export function DailyFoodSalesCardRender({
	totalFoodSales,
	selectedDate,
	salesDifferences = { foodSales: { difference: 0, positive: 0 } },
	sx,
}) {
	if (totalFoodSales === undefined) {
		return <CircularProgress />;
	}

	const formattedTotalFoodSales = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		totalFoodSales
	);

	const difference = salesDifferences.foodSales?.difference || 0;
	const positive = salesDifferences.foodSales?.positive || 0;
	const formattedDifference = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		difference
	);

	const formattedDate = moment(selectedDate).format('MM/DD');

	return (
		<Card sx={{ ...sx, backgroundColor: 'background.paper' }}>
			<CardContent>
				<Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline">
							Total Food Sales {formattedDate}
						</Typography>
						<Typography variant="h4">{formattedTotalFoodSales}</Typography>
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
							Since yesterday
						</Typography>
					</Stack>
				)}
			</CardContent>
		</Card>
	);
}

DailyFoodSalesCardRender.propTypes = {
	totalFoodSales: PropTypes.number,
	salesDifferences: PropTypes.shape({
		foodSales: PropTypes.object,
	}),
	selectedDate: PropTypes.object.isRequired,
	sx: PropTypes.object,
};
