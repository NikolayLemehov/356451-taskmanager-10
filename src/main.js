import SiteMenuComponent from "./components/site-menu-component";
import FilterComponent from "./components/filter-component";
import BoardComponent from "./components/board-component";
import TasksModel from './models/tasks-model';
import {generateTasks} from "./mock/task";
import {generateFilters} from './mock/filter.js';
import {renderElement} from "./utils/render";
import BoardController from "./controllers/board-controller";

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderElement(siteHeaderElement, new SiteMenuComponent());

const filters = generateFilters();
renderElement(siteMainElement, new FilterComponent(filters));

const boardComponent = new BoardComponent();
renderElement(siteMainElement, boardComponent);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();
