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

const TagCount = {
  MIN: 0,
  MAX: 3,
};

const getRandomIntegerNumber = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomBoolean = () => Math.random() < 0.5;

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = getRandomBoolean() ? -1 : 1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, defaultRepeatingDayWeek, {
    [getRandomArrayItem(Object.keys(defaultRepeatingDayWeek))]: getRandomBoolean()
  });
};

const generateTags = (array) => {
  return array
    .filter(() => getRandomBoolean())
    .slice(TagCount.MIN, TagCount.MAX);
};

const generateTask = (it, i) => {
  const dueDate = getRandomBoolean() ? null : getRandomDate();

  return {
    id: i,
    description: getRandomArrayItem(descriptionItems),
    dueDate,
    repeatingDays: dueDate ? defaultRepeatingDayWeek : generateRepeatingDays(),
    tags: new Set(generateTags(tags)),
    color: getRandomArrayItem(colors),
    isArchive: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTasks};
