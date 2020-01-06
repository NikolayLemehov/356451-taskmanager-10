import EmptyComponent from "../components/empty-component";
import SortingComponent from "../components/sorting-component";
import TaskListComponent from "../components/task-list-component";
import LoadMoreButtonComponent from "../components/load-more-button-component";
import TaskController from "./task-controller";
import {removeElement, renderElement} from "../utils/render";
import {SortType} from "../const";

const SHOWING_TASKS_PER_PAGE = 8;

export default class BoardController {
  constructor(containerComponent, tasksModel) {
    this._container = containerComponent.getElement();
    this._tasksModel = tasksModel;

    this._sortedTasks = [];
    this._showedTaskControllers = [];
    this._emptyComponent = new EmptyComponent();
    this._sortingComponent = new SortingComponent();
    this._taskListComponent = new TaskListComponent();
    this._taskListElement = this._taskListComponent.getElement();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._showingTasksCount = SHOWING_TASKS_PER_PAGE;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const tasks = this._tasksModel.getTasks();
    this._sortedTasks = tasks.slice();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    if (isAllTasksArchived) {
      renderElement(this._container, this._emptyComponent);
      return;
    }

    renderElement(this._container, this._sortingComponent);
    renderElement(this._container, this._taskListComponent);


    this._renderTasks(tasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();
  }

  _renderTasks(tasks) {
    const newTaskControllers = tasks.map((task) => {
      const taskController = new TaskController(this._taskListElement, this._onDataChange, this._onViewChange);
      taskController.render(task);

      return taskController;
    });
    this._showedTaskControllers = this._showedTaskControllers.concat(newTaskControllers);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    removeElement(this._loadMoreButtonComponent);
    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    renderElement(this._container, this._loadMoreButtonComponent);
    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    const tasks = this._tasksModel.getTasks();
    this._showingTasksCount += SHOWING_TASKS_PER_PAGE;

    this._renderTasks(tasks.slice(prevTasksCount, this._showingTasksCount));

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      removeElement(this._loadMoreButtonComponent);
    }
  }

  _onDataChange(taskController, oldTask, newTask) {
    if (newTask === null) {
      this._tasksModel.removeTask(oldTask.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      const isSuccess = this._tasksModel.updateTask(oldTask.id, newTask);

      if (isSuccess) {
        taskController.render(newTask);
      }
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const tasks = this._tasksModel.getTasks();
    switch (sortType) {
      case SortType.DATE_UP:
        this._sortedTasks = tasks.slice().sort((a, b) => (a.dueDate === null ? null : a.dueDate.getTime()) - (b.dueDate === null ? null : b.dueDate));
        break;
      case SortType.DATE_DOWN:
        this._sortedTasks = tasks.slice().sort((a, b) => (b.dueDate === null ? null : b.dueDate.getTime()) - (a.dueDate === null ? null : a.dueDate));
        break;
      case SortType.DEFAULT:
        this._sortedTasks = tasks.slice();
        break;
    }

    this._removeTasks();
    this._renderTasks(this._sortedTasks.slice(0, this._showingTasksCount));
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_PER_PAGE);
  }
}
