import {remove, render, replace} from "../utils/render";
import TaskComponent from "../components/task-component";
import TaskEditComponent from "../components/task-edit-component";
import EmptyComponent from "../components/empty-component";
import SortingComponent from "../components/sorting-component";
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

export default class BoardController {
  constructor(containerComponent) {
    this._containerComponent = containerComponent;
    this._emptyComponent = new EmptyComponent();
    this._sortingComponent = new SortingComponent();
    this._taskListComponent = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
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
    tasks.slice(0, showingTasksCount).forEach((task) => renderTask(taskListElement, task));

    render(container, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + ShowingTasksCount.BY_BUTTON;

      tasks.slice(prevTasksCount, showingTasksCount)
        .forEach((task) => renderTask(taskListElement, task));

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }
}
