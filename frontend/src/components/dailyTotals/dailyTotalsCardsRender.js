import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FaArrowUp, FaArrowDown, FaWhiskeyGlass, FaUtensils } from 'react-icons/fa6';
import { CiBeerMugFull } from 'react-icons/ci';
import { GiHamburger } from 'react-icons/gi';
import { success, error } from '../../theme/colors';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography, CircularProgress } from '@mui/material';

export function DailyFoodSalesCardRender({
	selectedDate,
	totalFoodSales,
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
		<Card sx={{ ...sx, width: '300px', backgroundColor: 'background.paper' }}>
			<CardContent>
				<Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline" noWrap>
							Food Sales {formattedDate}
						</Typography>
						<Typography variant="h5">{formattedTotalFoodSales}</Typography>
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
export function DailyBarSalesCardRender({
	selectedDate,
	totalBarSales,
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
		<Card sx={{ ...sx, width: '300px', backgroundColor: 'background.paper' }}>
			<CardContent>
				<Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
					<Stack spacing={1}>
						<Typography color="text.secondary" variant="overline" noWrap>
							Bar Sales {formattedDate}
						</Typography>
						<Typography variant="h5">{formattedTotalBarSales}</Typography>
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
								color={difference === 0 ? 'disabled' : positive ? 'success' : 'error'}
								fontSize="small"
							>
								{difference === 0 ? <FaWhiskeyGlass /> : positive ? <FaArrowUp /> : <FaArrowDown />}
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
