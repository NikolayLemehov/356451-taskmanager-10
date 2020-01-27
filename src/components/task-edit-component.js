import he from 'he';
import flatpickr from 'flatpickr';
import {colors, days} from '../const.js';
import {formatTime, formatDate} from '../utils/common';
import AbstractSmartComponent from './abstract-smart-component';

const DescriptionLength = {
  MIN: 1,
  MAX: 140,
};
const RED_COLOR_STYLE_PROPERTY = `color: red;`;

const getIsAllowableDescriptionLength = (description) => {
  const length = description.length;

  return length >= DescriptionLength.MIN &&
    length <= DescriptionLength.MAX;
};

const createColorsMarkup = (currentColor) => {
  return colors
    .map((color) => {
      return (
        `<input
          type="radio"
          id="color-${color}-4"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
        />
        <label
          for="color-${color}-4"
          class="card__color card__color--${color}"
          >${color}</label
        >`
      );
    })
    .join(``);
};

const createRepeatingDaysMarkup = (repeatingDays) => {
  return days
    .map((day) => {
      const isChecked = repeatingDays[day];
      return (
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-4"
          name="repeat"
          value="${day}"
          ${isChecked ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-4"
          >${day}</label
        >`
      );
    })
    .join(``);
};

const createHashtags = (tags) => {
  return Array.from(tags)
    .map((tag) => {
      return (
        `<span class="card__hashtag-inner">
          <input
            type="hidden"
            name="hashtag"
            value=${tag}
            class="card__hashtag-hidden-input"
          />
          <p class="card__hashtag-name">
            #${tag}
          </p>
          <button
              type="button"
              class="card__hashtag-delete"
          >
            delete
          </button>
        </span>`
      );
    })
    .join(``);
};

const createTaskEditTemplate = (task, option = {}) => {
  const {tags, dueDate, color} = task;
  const {isDateShowing, isRepeatingTask, repeatingDays, description: notSanitizedDescription} = option;

  const isExpired = dueDate < Date.now();
  const blockedSaveButtonAttribute = (isDateShowing && isRepeatingTask) ||
  (isRepeatingTask && !Object.values(repeatingDays).some((it) => it === true) ||
    !getIsAllowableDescriptionLength(notSanitizedDescription)) ? `disabled style='${RED_COLOR_STYLE_PROPERTY}'` : ``;

  const date = isDateShowing && !!dueDate ? formatDate(dueDate) : ``;
  const time = isDateShowing && !!dueDate ? formatTime(dueDate) : ``;

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const tagsMarkup = createHashtags(tags);
  const colorsMarkup = createColorsMarkup(color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(repeatingDays);

  const dateElement = (
    `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${date} ${time}"
        />
      </label>
    </fieldset>`
  );
  const repeatingDaysElement = (
    `<fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        ${repeatingDaysMarkup}
      </div>
    </fieldset>`
  );

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${he.encode(notSanitizedDescription)}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>

                ${isDateShowing ? dateElement : ``}

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>

                ${isRepeatingTask ? repeatingDaysElement : ``}
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${tagsMarkup}
                </div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${blockedSaveButtonAttribute}>save</button>
            <button class="card__delete" type="button" >delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEditComponent extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._repeatingDays = Object.assign({}, task.repeatingDays);
    this._description = task.description;
    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._saveBtnElement = this.getElement().querySelector(`.card__save`);
    this._deleteBtnElement = this.getElement().querySelector(`.card__delete`);
    this._cardInnerElement = this.getElement().querySelector(`.card__inner`);

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      repeatingDays: this._repeatingDays,
      description: this._description,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._repeatingDays = Object.assign({}, task.repeatingDays);
    this._description = task.description;

    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    return new FormData(form);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  disableSave() {
    this._saveBtnElement.disabled = `disabled`;
    this._saveBtnElement.textContent = `saving...`;
  }

  activeSave() {
    this._saveBtnElement.disabled = ``;
    this._saveBtnElement.textContent = `save`;
  }

  disableDelete() {
    this._deleteBtnElement.disabled = `disabled`;
    this._deleteBtnElement.textContent = `deleting...`;
  }

  activeDelete() {
    this._deleteBtnElement.disabled = ``;
    this._deleteBtnElement.textContent = `delete`;
  }

  activateWarningFrame() {
    this._cardInnerElement.style.outline = `10px solid red`;
  }

  deactivateWarningFrame() {
    this._cardInnerElement.style.outline = ``;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate === null ? new Date() : this._task.dueDate,
      });
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__text`)
      .addEventListener(`input`, (evt) => {
        this._description = evt.target.value;

        this._markSaveButton(getIsAllowableDescriptionLength(this._description));
      });

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;

        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;

        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._repeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }
  }

  _markSaveButton(isAllowableDescriptionLength) {
    const saveButton = this.getElement().querySelector(`.card__save`);
    saveButton.disabled = !isAllowableDescriptionLength;
    saveButton.style.cssText = isAllowableDescriptionLength ? `` : RED_COLOR_STYLE_PROPERTY;
  }
}
