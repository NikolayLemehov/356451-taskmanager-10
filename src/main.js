import SiteMenuComponent from "./components/site-menu-component";
import BoardComponent from "./components/board-component";
import TasksModel from './models/tasks-model';
import {generateTasks} from "./mock/task";
import {renderElement} from "./utils/render";
import BoardController from "./controllers/board-controller";
import FilterController from "./controllers/filter-controller";

const TASK_COUNT = 41;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderElement(siteHeaderElement, new SiteMenuComponent());
const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
renderElement(siteMainElement, boardComponent);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();
