import SiteMenuComponent from "./components/site-menu-component";
import FilterComponent from "./components/filter-component";
import BoardComponent from "./components/board-component";
import {generateTasks} from "./mock/task";
import {generateFilters} from './mock/filter.js';
import {render} from "./utils/render";
import BoardController from "./controllers/board-controller";

const TASK_COUNT = 21;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent());

const filters = generateFilters();
render(siteMainElement, new FilterComponent(filters));

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent);

const tasks = generateTasks(TASK_COUNT);

const boardController = new BoardController(boardComponent, tasks);
boardController.render();
