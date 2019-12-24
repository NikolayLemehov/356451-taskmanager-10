import {renderElement, replaceElement} from "../utils/render";
import TaskComponent from "../components/task-component";
import TaskEditComponent from "../components/task-edit-component";

export default class TaskController {
  constructor(container) {
    this._container = container;
  }

  render(task) {
    const taskListElement = this._container;
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
  }
}
