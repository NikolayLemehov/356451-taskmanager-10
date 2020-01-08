import moment from 'moment';

const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const getIsOneDay = (dateA, dateB) => {
  const FORMAT = `DD MM YYYY`;
  return moment(dateA).format(FORMAT) === moment(dateB).format(FORMAT);
};

const getIsOverdueDate = (dueDate, date) => {
  return dueDate < date && !getIsOneDay(date, dueDate);
};

export {formatTime, formatDate, getIsOneDay, getIsOverdueDate};
