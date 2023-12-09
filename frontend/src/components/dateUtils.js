import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export function formatDate(date, dateFormat = "eee, MMM d") {
    return format(new Date(date), dateFormat);
}

export const formatDateWithTimeZone = (dateString, timeZone) => {
    // Parse the input date string into a Date object
    const date = new Date(dateString);

    // Convert the date to the specified time zone
    const zonedDate = utcToZonedTime(date, timeZone);
    // Format the zoned date as desired (e.g., "Sun, Dec 3")
    const formattedDate = format(zonedDate, "eee, MMM d");
	
    return formattedDate;
};