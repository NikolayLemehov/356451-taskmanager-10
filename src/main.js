import SiteMenuComponent from "./components/site-menu";
import FilterComponent from "./components/filter";
import BoardComponent from "./components/board";
import TaskComponent from "./components/task";
import TaskEditComponent from "./components/task-edit";
import LoadMoreButtonComponent from "./components/load-more-button";
import {generateTasks} from "./mock/task";
import {generateFilters} from './mock/filter.js';
import {render} from "./utils";

const TASK_COUNT = 22;
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
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
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

  render(taskListElement, taskComponent.getElement());
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent().getElement());

const filters = generateFilters();
render(siteMainElement, new FilterComponent(filters).getElement());

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);

let showingTasksCount = ShowingTasksCount.ON_START;
tasks.slice(0, showingTasksCount).forEach((task) => renderTask(taskListElement, task));

const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, new LoadMoreButtonComponent().getElement());

const loadMoreButtonElement = boardElement.querySelector(`.load-more`);
loadMoreButtonElement.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + ShowingTasksCount.BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderTask(taskListElement, task));

  if (showingTasksCount >= tasks.length) {
    loadMoreButtonElement.remove();
  }
});
