export function FormattedDate(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const formattedDate = new Date(year, month, day);
    return `${formattedDate.toLocaleString('default', { month: 'short' })} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`;
}
export const FormInputDate = () => {
    const currentDate = new Date();
    const formInputDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    return formInputDate;
};