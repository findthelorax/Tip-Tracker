import { useCallback, useState } from 'react';

export const useHandleSubmissionError = (selectedTeamMember) => {
    const [submissionError, setSubmissionError] = useState(null);

    return useCallback(
        (error, dailyTotals) => {
            if (error.response && error.response.status === 400) {
                alert(
                    `Totals on ${dailyTotals.date} for ${selectedTeamMember.teamMemberName} - ${selectedTeamMember.position} already exists.`
                );
            } else {
                alert('An error occurred while submitting daily totals.');
            }
            console.error(error);
            setSubmissionError(error);
        },
        [selectedTeamMember, setSubmissionError]
    );
};