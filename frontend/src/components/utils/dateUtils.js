export const FormattedDate = (date) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    return formattedDate;
};

export const FormInputDate = () => {
    const currentDate = new Date();
    const formInputDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    return formInputDate;
};