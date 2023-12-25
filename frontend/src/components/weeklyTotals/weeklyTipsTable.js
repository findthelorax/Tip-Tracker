import React, { useContext, useMemo } from 'react';
import moment from 'moment';
import '../../app/App.css';
import { TeamContext } from '../../contexts/TeamContext';
import WeeklyTipsRender from './weeklyTipsTableRender';
import { titleToPropName, formatUSD } from '../../hooks/salesTotalsLogic';

export function WeeklyTipsTable({ selectedDate, setSelectedDate }) {
	const { team } = useContext(TeamContext);
	const date = moment(selectedDate);

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	let tips = useMemo(() => {
		return team
			.filter((member) => {
				const memberDate = moment(member.date);
				const selectedWeekStart = moment(selectedDate).startOf('week');
				const selectedWeekEnd = moment(selectedWeekStart).endOf('week');

				return memberDate.isSameOrAfter(selectedWeekStart) && memberDate.isSameOrBefore(selectedWeekEnd);
			})
			.sort((a, b) => {
				const positions = ['bartender', 'host', 'runner', 'server'];
				const positionA = positions.indexOf(a.position);
				const positionB = positions.indexOf(b.position);

				if (positionA !== positionB) {
					return positionA - positionB;
				}

				return a.teamMemberName.localeCompare(b.teamMemberName);
			})
			.map((member) => {
				let memberTips = {
					name: member.teamMemberName,
					position: member.position,
				};

				Object.keys(titleToPropName).forEach((key) => {
					memberTips[key] = formatUSD(
						member.dailyTotals.reduce((sum, total) => sum + total[titleToPropName[key]] || 0, 0)
					);
				});
				return memberTips;
			});
	}, [team, selectedDate]);

	const columns = [
		{ field: 'name', headerName: 'Name', flex: 1 },
		{ field: 'position', headerName: 'Position', flex: 1 },
		...Object.keys(titleToPropName).map((title) => ({ field: title, headerName: title, flex: 1 })),
	];

	const rows = tips.map((tip, index) => ({ id: index, ...tip }));

	return (
		<WeeklyTipsRender
			teamMembers={team}
			date={date}
			handleDateChange={handleDateChange}
			rows={rows}
			columns={columns}
		/>
	);
}