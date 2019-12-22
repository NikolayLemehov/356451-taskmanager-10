import AbstractComponent from "./abstract-component";

export default class LoadMoreButtonComponent extends AbstractComponent {
  getTemplate() {
    return (
      `<button class="load-more" type="button">load more</button>`
    );
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
