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
  constructor(containerComponent, tasks) {
    this._tasks = tasks;
    this._container = containerComponent.getElement();
    this._emptyComponent = new EmptyComponent();
    this._sortingComponent = new SortingComponent();
    this._taskListComponent = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._taskController = null;

    this._showingTasksCount = ShowingTasksCount.ON_START;
    this._sortedTasks = this._tasks.slice();
  }

  render() {
    const taskListElement = this._taskListComponent.getElement();
    this._taskController = new TaskController(taskListElement);

    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);
    if (isAllTasksArchived) {
      renderElement(this._container, this._emptyComponent);
      return;
    }

    renderElement(this._container, this._sortingComponent);
    renderElement(this._container, this._taskListComponent);


    this._renderTasks(this._tasks.slice(0, this._showingTasksCount));
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

      taskListElement.innerHTML = ``;
      this._renderTasks(this._sortedTasks.slice(0, this._showingTasksCount));
    });
  }

  _renderTasks(tasks) {
    return tasks.forEach((task) => this._taskController.render(task));
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount < this._sortedTasks.length) {
      renderElement(this._container, this._loadMoreButtonComponent);
    }
    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount += ShowingTasksCount.BY_BUTTON;

      this._renderTasks(this._sortedTasks.slice(prevTasksCount, this._showingTasksCount));

      if (this._showingTasksCount >= this._sortedTasks.length) {
        removeElement(this._loadMoreButtonComponent);
      }
    });
  }
}
