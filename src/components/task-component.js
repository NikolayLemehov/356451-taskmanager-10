import he from 'he';
import {monthNames} from '../const';
import {formatTime} from '../utils/common';
import AbstractComponent from './abstract-component';
import {debounce} from '../utils/debounce';

const DEBOUNCE_DELAY = 1000;

const createHashtagsMarkup = (hashtags) => {
  return hashtags
    .map((hashtag) => {
      return (
        `<span class="card__hashtag-inner">
            <span class="card__hashtag-name">
              #${hashtag}
            </span>
          </span>`
      );
    })
    .join(``);
};

const createTaskTemplate = (task) => {
  const {id, description: notSanitizedDescription, dueDate, repeatingDays, tags, color, isArchive, isFavorite} = task;

  const isDateShowing = !!dueDate;
  const date = isDateShowing ? `${dueDate.getDate()} ${monthNames[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const hashtags = createHashtagsMarkup(Array.from(tags));
  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const isExpired = dueDate < Date.now() && !!dueDate;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const isArchiveClass = isArchive ? `` : `card__btn--disabled`;
  const isFavoriteClass = isFavorite ? `` : `card__btn--disabled`;

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive ${isArchiveClass}">
              archive
            </button>
            <button type="button" class="card__btn card__btn--favorites ${isFavoriteClass}">
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${id}. ${he.encode(notSanitizedDescription)}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${hashtags}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

export default class TaskComponent extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isFavorite = task.isFavorite;
    this._isArchive = task.isArchive;
    this._cardInnerElement = this.getElement().querySelector(`.card__inner`);
    this._archiveBtnElement = this.getElement().querySelector(`.card__btn--archive`);
    this._favoritesBtnElement = this.getElement().querySelector(`.card__btn--favorites`);
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    const debounceHandler = debounce(handler, DEBOUNCE_DELAY);

    this._archiveBtnElement.addEventListener(`click`, () => {
      this._archiveBtnElement.classList.toggle(`card__btn--disabled`);
      debounceHandler(this._isArchive === this._archiveBtnElement.classList.contains(`card__btn--disabled`));
    });
  }

  setFavoritesButtonClickHandler(handler) {
    const debounceHandler = debounce(handler, DEBOUNCE_DELAY);

    this._favoritesBtnElement.addEventListener(`click`, () => {
      this._favoritesBtnElement.classList.toggle(`card__btn--disabled`);
      debounceHandler(this._isFavorite === this._favoritesBtnElement.classList.contains(`card__btn--disabled`));
    });
  }

  disableArchiveBtn() {
    this._archiveBtnElement.disabled = `disabled`;
  }

  activeArchiveBtn() {
    this._archiveBtnElement.disabled = ``;
  }

  disableFavoritesBtn() {
    this._favoritesBtnElement.disabled = `disabled`;
  }

  activeFavoritesBtn() {
    this._favoritesBtnElement.disabled = ``;
  }

  activateWarningFrame() {
    this._cardInnerElement.style.outline = `10px solid red`;
  }

  deactivateWarningFrame() {
    this._cardInnerElement.style.outline = ``;
  }
}
