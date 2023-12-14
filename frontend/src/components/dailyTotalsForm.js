import React, { useContext } from 'react';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { FormInputDate } from './utils/dateUtils';
import { NumberInput, TextInput, Select, Paper, Text, Button, Group } from '@mantine/core';

function InputField({ id, value, onChange, label, type = 'number', parseValue = parseFloat }) {
    if (type === 'date') {
        return (
            <TextInput
                id={id}
                label={label}
                type={type}
                value={value}
                onChange={(event) => onChange(id, event.target.value)}
                style={{ marginBottom: '1rem' }}
            />
        );
    }

    return (
        <NumberInput
            id={id}
            label={label}
            value={value}
            onChange={(value) => onChange(id, parseValue(value))}
            style={{ marginBottom: '1rem' }}
            placeholder="0"
            format={(value) => `$${value}`}
        />
    );
}

function TeamMemberSelect({ team, value = '', onChange }) {
    const { setSelectedTeamMember } = useContext(DailyTotalsContext);
    const handleTeamMemberSelect = (value) => {
        const selectedMember = team.find((member) => member._id === value);
        setSelectedTeamMember(selectedMember);
        onChange('teamMemberID', selectedMember ? selectedMember._id : '');
    };
    return (
        <Select
            label="Team Member"
            value={value}
            onChange={handleTeamMemberSelect}
            data={team.map((member) => ({
                value: member._id,
                label: `${member.teamMemberName} - ${member.position}`,
            }))}
            placeholder="Select Team Member"
            style={{ marginBottom: '1rem' }}
        />
    );
}

function DailyTotalsForm({
    team,
    dailyTotals,
    setDailyTotals,
    submitDailyTotals,
    selectedTeamMember,
    setSelectedTeamMember,
}) {

    const handleDailyTotalsChange = (field, value) => {
        let updates = { [field]: value === '' ? 0 : value };

        setDailyTotals((prevDailyTotals) => ({
            ...prevDailyTotals,
            ...updates,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitDailyTotals(dailyTotals, selectedTeamMember);
    };

    return (
        <Paper padding="md" style={{ marginBottom: '1rem' }}>
            <Text align="center" size="xl" weight={500}>
                Daily Totals
            </Text>
            <form onSubmit={handleSubmit}>
                <TeamMemberSelect team={team} value={selectedTeamMember._id} onChange={handleDailyTotalsChange} />
                <InputField
                    id="date"
                    value={dailyTotals.date || FormInputDate()}
                    onChange={handleDailyTotalsChange}
                    label="Date"
                    type="date"
                    parseValue={(value) => value}
                />
                <InputField
                    id="foodSales"
                    value={dailyTotals.foodSales}
                    onChange={handleDailyTotalsChange}
                    label="Food Sales"
                />
                <InputField
                    id="barSales"
                    value={dailyTotals.barSales}
                    onChange={handleDailyTotalsChange}
                    label="Bar Sales"
                />
                <InputField
                    id="nonCashTips"
                    value={dailyTotals.nonCashTips}
                    onChange={handleDailyTotalsChange}
                    label="Non-Cash Tips"
                />
                <InputField
                    id="cashTips"
                    value={dailyTotals.cashTips}
                    onChange={handleDailyTotalsChange}
                    label="Cash Tips"
                />
                <Group position="center">
                    <Button color="blue" type="submit">
                        Submit Daily Totals
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}

export default DailyTotalsForm;