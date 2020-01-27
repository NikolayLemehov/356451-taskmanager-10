import {FilterType} from '../const.js';
import {getTasksByFilter} from '../utils/filter';

export default class TasksModel {
  constructor() {
    this._taskAdapterModels = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getTasks() {
    return getTasksByFilter(this._taskAdapterModels, this._activeFilterType);
  }

  getTasksAll() {
    return this._taskAdapterModels;
  }

  setTasks(taskAdapterModels) {
    this._taskAdapterModels = Array.from(taskAdapterModels);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  getFilters() {
    return Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(this.getTasksAll(), filterType).length,
        isChecked: filterType === this._activeFilterType,
      };
    });
  }

  updateTask(id, taskAdapterModel) {
    const index = this._taskAdapterModels.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._taskAdapterModels = [].concat(this._taskAdapterModels.slice(0, index), taskAdapterModel, this._taskAdapterModels.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeTask(id) {
    return this.updateTask(id, []);
  }

  addTask(task) {
    this._taskAdapterModels = [].concat(task, this._taskAdapterModels);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
