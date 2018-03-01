const moment = require('moment');

export const shortMonthYear = (date) => {

    return date ? moment(date).format('MMM YY') : ''
}
export const shortMonthDay = (date) => {

    return date ? moment(date).format('MMM D') : ''
}

export const shortTime = (date) => {

    return date ? moment(date).format('h:m A') : '';
}


export const fullDateTime = (date) => {

    return date ? moment(date).format('MM/DD/YYYY hh:mm a') : '';
}

export const fullDate = (date) => {

    return date ? moment(String(value)).format('MM/DD/YYYY') : ''
}

export const fullTime = (date) => {

    return date ? moment(String(value)).format('hh:mm') : ''
}
