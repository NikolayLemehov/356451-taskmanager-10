import {remove, render, replace} from "../utils/render";
import TaskComponent from "../components/task-component";
import TaskEditComponent from "../components/task-edit-component";
import EmptyComponent from "../components/empty-component";
import SortingComponent, {SortType} from "../components/sorting-component";
import TaskListComponent from "../components/task-list-component";
import LoadMoreButtonComponent from "../components/load-more-button-component";

const ShowingTasksCount = {
  ON_START: 8,
  BY_BUTTON: 8,
};

const renderTask = (taskListElement, task) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const taskComponent = new TaskComponent(task);
  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setSubmitHandler(replaceEditToTask);

  render(taskListElement, taskComponent);
};
const renderTasks = (taskListElement, tasks) => tasks.forEach((task) => renderTask(taskListElement, task));

export default class BoardController {
  constructor(containerComponent) {
    this._containerComponent = containerComponent;
    this._emptyComponent = new EmptyComponent();
    this._sortingComponent = new SortingComponent();
    this._taskListComponent = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const renderLoadMoreButton = () => {
      render(container, this._loadMoreButtonComponent);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + ShowingTasksCount.BY_BUTTON;

        renderTasks(taskListElement, tasks.slice(prevTasksCount, showingTasksCount));

        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };

    const container = this._containerComponent.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._emptyComponent);
      return;
    }

    render(container, this._sortingComponent);
    render(container, this._taskListComponent);

    const taskListElement = this._taskListComponent.getElement();

    let showingTasksCount = ShowingTasksCount.ON_START;
    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));
    renderLoadMoreButton();

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];

      switch (sortType) {
        case SortType.DATE_UP:
          sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
        case SortType.DATE_DOWN:
          sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case SortType.DEFAULT:
          sortedTasks = tasks.slice(0, showingTasksCount);
          break;
      }

      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);

      if (sortType === SortType.DEFAULT) {
        renderLoadMoreButton();
      } else {
        remove(this._loadMoreButtonComponent);
      }
    });
  }
}
