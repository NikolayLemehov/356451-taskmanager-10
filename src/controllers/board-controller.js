import EmptyComponent from '../components/empty-component';
import SortingComponent from '../components/sorting-component';
import TaskListComponent from '../components/task-list-component';
import LoadMoreButtonComponent from '../components/load-more-button-component';
import TaskController, {Mode} from './task-controller';
import {removeElement, renderElement} from '../utils/renderElement';
import {SortType, EmptyTask} from '../const';

const SHOWING_TASKS_PER_PAGE = 8;

export default class BoardController {
  constructor(containerComponent, tasksModel, api) {
    this._containerComponent = containerComponent;
    this._container = containerComponent.getElement();
    this._tasksModel = tasksModel;
    this._api = api;

    this._sortedTasks = [];
    this._showedTaskControllers = [];
    this._creatingTaskController = null;
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

  hide() {
    this._containerComponent.hide();
  }

  show() {
    this._containerComponent.show();
  }

  createTask() {
    if (this._creatingTaskController) {
      return;
    }

    this._creatingTaskController = new TaskController(this._taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTaskController.render(EmptyTask, Mode.ADDING);
  }

  _renderTasks(taskAdapterModels) {
    const newTaskControllers = taskAdapterModels.map((taskAdapterModel) => {
      const taskController = new TaskController(this._taskListElement, this._onDataChange, this._onViewChange);
      taskController.render(taskAdapterModel, Mode.DEFAULT);

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

  _onDataChange(taskController, oldTask, newTaskAdapterModel) {
    if (oldTask === EmptyTask) {
      this._creatingTaskController = null;
      if (newTaskAdapterModel === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._api.createTask(newTaskAdapterModel)
          .then((taskAdapterModel) => {
            this._tasksModel.addTask(taskAdapterModel);
            taskController.render(taskAdapterModel, Mode.DEFAULT);

            const destroyedTask = this._showedTaskControllers.pop();
            destroyedTask.destroy();

            this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
            this._showingTasksCount = this._showedTaskControllers.length;
          })
          .catch(() => {
            taskController.shake();
          });
      }
    } else if (newTaskAdapterModel === null) {
      this._api.deleteTask(oldTask.id)
        .then(() => {
          this._tasksModel.removeTask(oldTask.id);
          this._updateTasks(this._showingTasksCount);
        })
        .catch(() => {
          taskController.shake();
        });
    } else {
      this._api.updateTask(oldTask.id, newTaskAdapterModel)
        .then((taskAdapterModel) => {
          const isSuccess = this._tasksModel.updateTask(oldTask.id, taskAdapterModel);
          if (isSuccess) {
            taskController.render(taskAdapterModel, Mode.DEFAULT);
            this._updateTasks(this._showingTasksCount);
          }
        })
        .catch(() => {
          taskController.shake();
        });
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
