import { utcToZonedTime } from "date-fns-tz";
import { format, isValid } from "date-fns";

export function formatDate(date, dateFormat = "eee, MMM d") {
    const currentYear = new Date().getFullYear();
    const dateStringWithYear = `${date}, ${currentYear}`;

    // Check if the input date is a valid date
    if (!isValid(new Date(dateStringWithYear))) {
        console.error("Invalid date string:", date);
        return "Invalid Date";
    }

    return format(new Date(dateStringWithYear), dateFormat);
}

export const formatDateWithTimeZone = (dateString, timeZone, dateFormat = "eee, MMM d") => {
    const currentYear = new Date().getFullYear();
    const dateStringWithYear = `${dateString}, ${currentYear}`;

    // Check if the input date string is a valid date
    const parsedDate = new Date(dateStringWithYear);

    // Convert the date to the specified time zone
    const zonedDate = utcToZonedTime(parsedDate, timeZone);

    // Format the zoned date as desired
    const formattedDate = format(zonedDate, dateFormat);
    
    return formattedDate;
};