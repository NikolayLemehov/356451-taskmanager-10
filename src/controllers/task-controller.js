import {RenderPosition, removeElement, renderElement, replaceElement} from "../utils/renderElement";
import {EmptyTask} from "../const";
import TaskComponent from "../components/task-component";
import TaskEditComponent from "../components/task-edit-component";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._replaceEditToTask = this._replaceEditToTask.bind(this);
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, Object.assign({}, task, data));
      this._replaceEditToTask();
    });
    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replaceElement(this._taskComponent, oldTaskComponent);
          replaceElement(this._taskEditComponent, oldTaskEditComponent);
        } else {
          renderElement(this._container, this._taskComponent);
        }
        break;
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          removeElement(oldTaskComponent);
          removeElement(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    removeElement(this._taskEditComponent);
    removeElement(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._taskEditComponent.reset();
    replaceElement(this._taskComponent, this._taskEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replaceElement(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
    }
  }
}
