import AbstractComponent from "./abstract-component";

const FILTER_ID_PREFIX = `filter__`;

const createFilterMarkup = ({name, count, isChecked}) => {
  return (
    `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span>
      </label>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter)).join(``);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterType = evt.target.id.substring(FILTER_ID_PREFIX.length);
      handler(filterType);
    });
  }
}
