import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";

export function formatDate(date, dateFormat = "EEE, MMM d") {
    return format(new Date(date), dateFormat);
}

// Function to format date with time zone
export function formatDateWithTimeZone(
	date,
	dateFormat = 'EEE, MMM d',
	timeZone = 'America/New_York'
) {
	return formatInTimeZone(new Date(date), dateFormat, { timeZone });
}
