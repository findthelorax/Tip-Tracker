import moment from 'moment';

export function FormattedDate(dateString) {
    const date = moment(dateString).local();
    console.log("🚀 ~ file: utils.js:10 ~ FormattedDate ~ date:", date)
    return date.format('MMM D, YYYY');
}

export const FormInputDate = () => {
    const currentDate = moment().local();
    console.log("🚀 ~ file: utils.js:17 ~ FormInputDate ~ currentDate:", currentDate)
    return currentDate.format('YYYY-MM-DD');
};