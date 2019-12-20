import SiteMenuComponent from "./components/site-menu-component";
import FilterComponent from "./components/filter-component";
import BoardComponent from "./components/board-component";
import TaskComponent from "./components/task-component";
import TaskListComponent from "./components/task-list-component";
import TaskEditComponent from "./components/task-edit-component";
import LoadMoreButtonComponent from "./components/load-more-button-component";
import EmptyComponent from "./components/empty-component";
import SortingComponent from "./components/sorting-component";
import {generateTasks} from "./mock/task";
import {generateFilters} from './mock/filter.js';
import {render, remove, replace} from "./utils/render";

const TASK_COUNT = 21;
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
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);

  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);

  editForm.addEventListener(`submit`, replaceEditToTask);

  render(taskListElement, taskComponent);
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new EmptyComponent());
    return;
  }

  render(boardComponent.getElement(), new SortingComponent());
  render(boardComponent.getElement(), new TaskListComponent());

  const taskListElement = siteMainElement.querySelector(`.board__tasks`);

  let showingTasksCount = ShowingTasksCount.ON_START;
  tasks.slice(0, showingTasksCount).forEach((task) => renderTask(taskListElement, task));

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent);

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + ShowingTasksCount.BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      remove(loadMoreButtonComponent);
    }
  });
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent());

const filters = generateFilters();
render(siteMainElement, new FilterComponent(filters));

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent);

const tasks = generateTasks(TASK_COUNT);

renderBoard(boardComponent, tasks);
