import API from "./api";
import SiteMenuComponent from "./components/site-menu-component";
import BoardComponent from "./components/board-component";
import StatisticsComponent from "./components/statistics-component";
import TasksModel from './models/tasks-model';
import {renderElement} from "./utils/renderElement";
import {MenuItem} from "./const";
import BoardController from "./controllers/board-controller";
import FilterController from "./controllers/filter-controller";
import 'flatpickr/dist/flatpickr.css';

const AUTHORIZATION = `Basic 6PZAzyuh8iBERIAL536X`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/task-manager`;
const api = new API(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const siteMenuComponent = new SiteMenuComponent();
renderElement(siteHeaderElement, siteMenuComponent);
const tasksModel = new TasksModel();

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const statisticsComponent = new StatisticsComponent({tasksModel, dateFrom, dateTo});

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
renderElement(siteMainElement, boardComponent);
renderElement(siteMainElement, statisticsComponent);

const boardController = new BoardController(boardComponent, tasksModel);

statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
    filterController.render();
  });
