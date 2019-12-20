const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, component) => {
  container.append(component.getElement());
};

const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

const replace = (newComponent, oldComponent) => {
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
  const parentElement = oldElement.parentElement;
  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export {createElement, render, remove, replace};
