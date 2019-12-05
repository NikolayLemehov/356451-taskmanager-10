const filterNames = [
  `all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`
];

const generateFilters = () => filterNames.map((it) => ({
  name: it,
  count: Math.floor(Math.random() * 10),
}));

export {generateFilters};
