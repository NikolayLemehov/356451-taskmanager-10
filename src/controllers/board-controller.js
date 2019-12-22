import TaskComponent from "../components/task-component";
import TaskEditComponent from "../components/task-edit-component";
import EmptyComponent from "../components/empty-component";
import SortingComponent from "../components/sorting-component";
import TaskListComponent from "../components/task-list-component";
import LoadMoreButtonComponent from "../components/load-more-button-component";
import {removeElement, renderElement, replaceElement} from "../utils/render";
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
    const renderTask = (taskListElement, task) => {
      const onEscKeyDown = (evt) => {
        const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

        if (isEscKey) {
          replaceEditToTask();
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };

      const replaceEditToTask = () => {
        replaceElement(taskComponent, taskEditComponent);
      };

      const replaceTaskToEdit = () => {
        replaceElement(taskEditComponent, taskComponent);
      };

      const taskComponent = new TaskComponent(task);
      taskComponent.setEditButtonClickHandler(() => {
        replaceTaskToEdit();
        document.addEventListener(`keydown`, onEscKeyDown);
      });

      const taskEditComponent = new TaskEditComponent(task);
      taskEditComponent.setSubmitHandler(replaceEditToTask);

      renderElement(taskListElement, taskComponent);
    };
    const renderTasks = (taskListElement, tasks) => tasks.forEach((task) => renderTask(taskListElement, task));
    const renderLoadMoreButton = (tasks) => {
      renderElement(container, this._loadMoreButtonComponent);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + ShowingTasksCount.BY_BUTTON;

        renderTasks(taskListElement, tasks.slice(prevTasksCount, showingTasksCount));

        if (showingTasksCount >= tasks.length) {
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

    let showingTasksCount = ShowingTasksCount.ON_START;
    renderTasks(taskListElement, this._tasks.slice(0, showingTasksCount));
    renderLoadMoreButton(this._tasks);

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];

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
      showingTasksCount = ShowingTasksCount.ON_START;
      renderTasks(taskListElement, sortedTasks.slice(0, showingTasksCount));
      renderLoadMoreButton(sortedTasks);
    });
  }
}
