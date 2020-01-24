import nanoid from "nanoid";
import TaskAdapterModel from "../models/task-adapter-model";

const getSyncedTasks =
  (items) => items.filter(({success}) => success).map(({payload}) => payload.task);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getTasks() {
    if (this._isOnLine()) {
      return this._api.getTasks()
        .then((tasks) => {
          tasks.forEach((task) => this._store.setItem(task.id, task.getRAW()));
          return tasks;
        });
    }
    const storeTasks = Object.values(this._store.getAll());

    this._isSynchronized = false;

    return Promise.resolve(TaskAdapterModel.parseTasks(storeTasks));
  }

  createTask(task) {
    if (this._isOnLine()) {
      return this._api.createTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.getRAW());
          return newTask;
        });
    }

    const fakeNewTaskId = nanoid();
    const fakeNewTask = TaskAdapterModel.parseTask(Object.assign({}, task.getRAW(), {id: fakeNewTaskId}));

    this._isSynchronized = false;
    this._store.setItem(fakeNewTask.id, Object.assign({}, fakeNewTask.getRAW(), {offline: true}));

    return Promise.resolve(fakeNewTask);
  }

  updateTask(id, task) {
    if (this._isOnLine()) {
      return this._api.updateTask(id, task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.getRAW());
          return newTask;
        });
    }

    const fakeUpdatedTask = TaskAdapterModel.parseTask(Object.assign({}, task.getRAW(), {id}));

    this._isSynchronized = false;
    this._store.setItem(id, Object.assign({}, fakeUpdatedTask.getRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedTask);
  }

  deleteTask(id) {
    if (this._isOnLine()) {
      return this._api.deleteTask(id)
        .then(() => {
          this._store.removeItem(id);
        });
    }

    this._isSynchronized = false;
    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storeTasks = Object.values(this._store.getAll());

      return this._api.sync(storeTasks)
        .then((response) => {
          storeTasks.filter((task) => task.offline).forEach((task) => {
            this._store.removeItem(task.id);
          });

          const createdTasks = getSyncedTasks(response.created);
          const updatedTasks = getSyncedTasks(response.updated);

          [...createdTasks, ...updatedTasks].forEach((task) => {
            this._store.setItem(task.id, task);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
