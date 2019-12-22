import AbstractComponent from "./abstract-component";

const createEmptyTemplate = () => {
  return (
    `<p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>`
  );
};


export default class EmptyComponent extends AbstractComponent {
  getTemplate() {
    return createEmptyTemplate();
  }
}
