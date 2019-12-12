const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  const interval = date.getHours() > 11 ? `pm` : `am`;

  return `${hours}:${minutes} ${interval}`;
};

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

export {formatTime, render};
