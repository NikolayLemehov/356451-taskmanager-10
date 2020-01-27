import {RenderPosition, removeElement, renderElement, replaceElement} from '../utils/renderElement';
import {days, EmptyTask} from '../const';
import TaskComponent from '../components/task-component';
import TaskEditComponent from '../components/task-edit-component';
import TaskAdapterModel from '../models/task-adapter-model';
import {getNoRepeatingDays} from '../utils/common';

const SHAKE_ANIMATION_TIMEOUT = 600;

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

  render(taskAdapterModel, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(taskAdapterModel);
    this._taskEditComponent = new TaskEditComponent(taskAdapterModel);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler((isChangeArchive) => {
      if (!isChangeArchive) {
        return;
      }
      this._taskComponent.disableArchiveBtn();
      const newTaskAdapterModel = TaskAdapterModel.clone(taskAdapterModel);
      newTaskAdapterModel.isArchive = !newTaskAdapterModel.isArchive;
      this._onDataChange(this, taskAdapterModel, newTaskAdapterModel);
    });

    this._taskComponent.setFavoritesButtonClickHandler((isChangeFavorite) => {
      if (!isChangeFavorite) {
        return;
      }
      this._taskComponent.disableFavoritesBtn();
      const newTaskAdapterModel = TaskAdapterModel.clone(taskAdapterModel);
      newTaskAdapterModel.isFavorite = !newTaskAdapterModel.isFavorite;
      this._onDataChange(this, taskAdapterModel, newTaskAdapterModel);
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._taskEditComponent.getData();
      this._taskEditComponent.disableSave();
      const newTaskAdapterModel = this._parseFormData(formData, taskAdapterModel);
      this._onDataChange(this, taskAdapterModel, newTaskAdapterModel);
    });
    this._taskEditComponent.setDeleteButtonClickHandler(() => {
      this._taskEditComponent.disableDelete();
      this._onDataChange(this, taskAdapterModel, null);
    });

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

  shake() {
    const removeAnimation = () => {
      this._taskEditComponent.getElement().classList.remove(`shake`);
      this._taskComponent.getElement().classList.remove(`shake`);
      this._taskEditComponent.deactivateWarningFrame();
      this._taskComponent.deactivateWarningFrame();
    };
    const animate = () => {
      this._taskEditComponent.activeSave();
      this._taskEditComponent.activeDelete();
      this._taskComponent.activeArchiveBtn();
      this._taskComponent.activeFavoritesBtn();

      this._taskEditComponent.activateWarningFrame();
      this._taskComponent.activateWarningFrame();

      this._taskEditComponent.getElement().classList.add(`shake`);
      this._taskComponent.getElement().classList.add(`shake`);
      setTimeout(removeAnimation, SHAKE_ANIMATION_TIMEOUT);
    };
    setTimeout(animate, SHAKE_ANIMATION_TIMEOUT);
  }

  _parseFormData(formData, taskAdapterModel) {
    const date = formData.get(`date`);

    return new TaskAdapterModel({
      'description': formData.get(`text`),
      'color': formData.get(`color`),
      'tags': formData.getAll(`hashtag`),
      'due_date': date ? new Date(date) : null,
      'repeating_days': formData.getAll(`repeat`).reduce((acc, it) => {
        acc[it] = true;
        return acc;
      }, getNoRepeatingDays(days)),
      'id': taskAdapterModel.id,
      'is_favorite': taskAdapterModel.isFavorite,
      'is_archived': taskAdapterModel.isArchive,
    });
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
