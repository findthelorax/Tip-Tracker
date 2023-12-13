export const FormattedDate = (date) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    return formattedDate;
};