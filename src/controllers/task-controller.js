import {renderElement, replaceElement} from "../utils/render";
import TaskComponent from "../components/task-component";
import TaskEditComponent from "../components/task-edit-component";

export default class TaskController {
  constructor(container) {
    this._container = container;

    this._taskComponent = null;
    this._taskEditComponent = null;
  }

  render(task) {
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    const taskListElement = this._container;
    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        this._replaceEditToTask();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler(this._replaceEditToTask);

    renderElement(taskListElement, this._taskComponent);
  }

  _replaceEditToTask() {
    replaceElement(this._taskComponent, this._taskEditComponent);
  }

  _replaceTaskToEdit() {
    replaceElement(this._taskEditComponent, this._taskComponent);
  }
}
