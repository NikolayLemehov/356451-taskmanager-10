import FilterComponent from '../components/filter-component';
import {renderElement, replaceElement} from '../utils/renderElement';

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tasksModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const filters = this._tasksModel.getFilters();
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replaceElement(this._filterComponent, oldComponent);
    } else {
      renderElement(this._container, this._filterComponent);
    }
  }

  _onFilterChange(filterType) {
    this._tasksModel.setFilter(filterType);
  }

  _onDataChange() {
    this.render();
  }
}
