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
    this._containerComponent = containerComponent;
    this._emptyComponent = new EmptyComponent();
    this._sortingComponent = new SortingComponent();
    this._taskListComponent = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render() {
    const renderTasks = (tasks) => tasks.forEach((task) => taskController.render(task));
    const renderLoadMoreButton = () => {
      if (showingTasksCount < sortedTasks.length) {
        renderElement(container, this._loadMoreButtonComponent);
      }
      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + ShowingTasksCount.BY_BUTTON;

        renderTasks(sortedTasks.slice(prevTasksCount, showingTasksCount));

        if (showingTasksCount >= sortedTasks.length) {
          removeElement(this._loadMoreButtonComponent);
        }
      });
    };

    const container = this._containerComponent.getElement();
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);
    if (isAllTasksArchived) {
      renderElement(container, this._emptyComponent);
      return;
    }

    renderElement(container, this._sortingComponent);
    renderElement(container, this._taskListComponent);

    const taskListElement = this._taskListComponent.getElement();
    const taskController = new TaskController(taskListElement);

    let showingTasksCount = ShowingTasksCount.ON_START;
    renderTasks(this._tasks.slice(0, showingTasksCount));
    let sortedTasks = this._tasks;
    renderLoadMoreButton();

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      switch (sortType) {
        case SortType.DATE_UP:
          sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
        case SortType.DATE_DOWN:
          sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case SortType.DEFAULT:
          sortedTasks = this._tasks;
          break;
      }

      taskListElement.innerHTML = ``;
      renderTasks(sortedTasks.slice(0, showingTasksCount));
    });
  }
}
