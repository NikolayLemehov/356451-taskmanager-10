const Color = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`,
};

const colors = Array.from(Object.values(Color)).map((it) => it);

const days = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];

const EmptyTask = {
  id: `new`,
  description: ``,
  dueDate: null,
  repeatingDays: days.reduce((acc, it) => {
    acc[it] = false;
    return acc;
  }, {}),
  tags: [],
  color: Color.BLACK,
  isFavorite: false,
  isArchive: false,
};

const monthNames = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const SortType = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`,
};

const FilterType = {
  ALL: `all`,
  ARCHIVE: `archive`,
  FAVORITES: `favorites`,
  OVERDUE: `overdue`,
  REPEATING: `repeating`,
  TAGS: `tags`,
  TODAY: `today`,
};

export {colors, days, EmptyTask, monthNames, SortType, FilterType};
