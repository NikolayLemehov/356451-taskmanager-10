import {colors, days} from "../const";

const descriptionItems = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const defaultRepeatingDayWeek = {};
days.forEach((it) => {
  defaultRepeatingDayWeek[it] = false;
});

const tags = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`
];

const getRandomIntegerNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() < 0.5 ? -1 : 1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, defaultRepeatingDayWeek, {
    [getRandomArrayItem(Object.keys(defaultRepeatingDayWeek))]: Math.random() < 0.5
  });
};

const generateTags = (array) => {
  return array
    .filter(() => Math.random() < 0.5)
    .slice(0, 3);
};

const generateTask = () => {
  const dueDate = Math.random() < 0.5 ? null : getRandomDate();

  return {
    description: getRandomArrayItem(descriptionItems),
    dueDate,
    repeatingDays: dueDate ? defaultRepeatingDayWeek : generateRepeatingDays(),
    tags: new Set(generateTags(tags)),
    color: getRandomArrayItem(colors),
    isArchive: Math.random() < 0.5,
    isFavorite: Math.random() < 0.5,
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTasks};
