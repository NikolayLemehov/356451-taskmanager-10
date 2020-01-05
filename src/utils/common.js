import moment from 'moment';

const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const getIsOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

const getIsOverdueDate = (dueDate, date) => {
  return dueDate < date && !getIsOneDay(date, dueDate);
};

export {formatTime, formatDate, getIsOneDay, getIsOverdueDate};
