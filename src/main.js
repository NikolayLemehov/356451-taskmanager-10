import {createSiteMenuTemplate} from "./components/site-menu";
import {createFilterTemplate} from "./components/filter";
import {createBoardTemplate} from "./components/board";
import {createTaskTemplate} from "./components/task";
import {createTaskEditTemplate} from "./components/task-edit";
import {createLoadMoreButtonTemplate} from "./components/load-more-button";
import {generateTasks} from "./mock/task";
import {generateFilters} from './mock/filter.js';
const TASK_COUNT = 22;
const ShowingTasksCount = {
  ON_START: 8,
  BY_BUTTON: 8,
};

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate());

const filters = generateFilters();
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);

render(taskListElement, createTaskEditTemplate(tasks[0]));
let showingTasksCount = ShowingTasksCount.ON_START;
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, createTaskTemplate(task)));

const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, createLoadMoreButtonTemplate());

const loadMoreButtonElement = boardElement.querySelector(`.load-more`);
loadMoreButtonElement.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + ShowingTasksCount.BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task)));

  if (showingTasksCount >= tasks.length) {
    loadMoreButtonElement.remove();
  }
});
