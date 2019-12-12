export default class LoadMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return (
      `<button class="load-more" type="button">load more</button>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = this.getTemplate();
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
