import EmptyComponent from "../components/empty-component";
import SortingComponent from "../components/sorting-component";
import TaskListComponent from "../components/task-list-component";
import LoadMoreButtonComponent from "../components/load-more-button-component";
import TaskController from "./task-controller";
import {removeElement, renderElement} from "../utils/render";
import {SortType} from "../const";

const ShowingTasksCount = {
  ON_START: 8,
  BY_BUTTON: 8,
};

export default class BoardController {
  constructor(containerComponent) {
    this._tasks = [];
    this._sortedTasks = [];
    this._showedTaskControllers = [];
    this._container = containerComponent.getElement();
    this._emptyComponent = new EmptyComponent();
    this._sortingComponent = new SortingComponent();
    this._taskListComponent = new TaskListComponent();
    this._taskListElement = this._taskListComponent.getElement();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._showingTasksCount = ShowingTasksCount.ON_START;

    this._onDataChange = this._onDataChange.bind(this);
  }

  render(tasks) {
    this._tasks = tasks;
    this._sortedTasks = this._tasks.slice();
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);
    if (isAllTasksArchived) {
      renderElement(this._container, this._emptyComponent);
      return;
    }

    renderElement(this._container, this._sortingComponent);
    renderElement(this._container, this._taskListComponent);


    const newTaskControllers = this._renderTasks(this._tasks.slice(0, this._showingTasksCount), this._onDataChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTaskControllers);
    this._renderLoadMoreButton();

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      switch (sortType) {
        case SortType.DATE_UP:
          this._sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
        case SortType.DATE_DOWN:
          this._sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case SortType.DEFAULT:
          this._sortedTasks = this._tasks.slice();
          break;
      }

      this._taskListElement.innerHTML = ``;
      this._showedTaskControllers = this._renderTasks(this._sortedTasks.slice(0, this._showingTasksCount), this._onDataChange);
    });
  }

  _renderTasks(tasks, onDataChange) {
    return tasks.map((task) => {
      const taskController = new TaskController(this._taskListElement, onDataChange);
      taskController.render(task);

      return taskController;
    });
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount < this._sortedTasks.length) {
      renderElement(this._container, this._loadMoreButtonComponent);
    }
    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount += ShowingTasksCount.BY_BUTTON;

      const newTaskControllers = this._renderTasks(this._sortedTasks.slice(prevTasksCount, this._showingTasksCount), this._onDataChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTaskControllers);

      if (this._showingTasksCount >= this._sortedTasks.length) {
        removeElement(this._loadMoreButtonComponent);
      }
    });
  }

  _onDataChange(taskController, oldTask, newTask) {
    const index = this._tasks.findIndex((it) => it === oldTask);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newTask, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }
}
