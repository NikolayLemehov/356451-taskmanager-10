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

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent().getElement());

const filters = generateFilters();
render(siteMainElement, new FilterComponent(filters).getElement());
render(siteMainElement, new BoardComponent().getElement());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);

render(taskListElement, new TaskEditComponent(tasks[0]).getElement());
let showingTasksCount = ShowingTasksCount.ON_START;
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, new TaskComponent(task).getElement()));

const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, new LoadMoreButtonComponent().getElement());

const loadMoreButtonElement = boardElement.querySelector(`.load-more`);
loadMoreButtonElement.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + ShowingTasksCount.BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, new TaskComponent(task).getElement()));

  if (showingTasksCount >= tasks.length) {
    loadMoreButtonElement.remove();
  }
});
