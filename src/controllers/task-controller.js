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

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler(this._replaceEditToTask);

    renderElement(this._container, this._taskComponent);
  }

  _replaceEditToTask() {
    replaceElement(this._taskComponent, this._taskEditComponent);
  }

  _replaceTaskToEdit() {
    replaceElement(this._taskEditComponent, this._taskComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
