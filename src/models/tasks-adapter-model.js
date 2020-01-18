export default class TasksAdapterModel {
  constructor(endData) {
    this.id = endData[`id`];
    this.description = endData[`description`];
    this.color = endData[`color`];
    this.tags = new Set(endData[`tags`]);
    this.dueDate = endData[`due_date`] ? new Date(endData[`due_date`]) : null;
    this.repeatingDays = endData[`repeating_days`];
    this.isFavorite = Boolean(endData[`is_favorite`]);
    this.isArchive = Boolean(endData[`is_archived`]);
  }

  static parseTask(endData) {
    return new TasksAdapterModel(endData);
  }

  static parseTasks(endData) {
    return endData.map(TasksAdapterModel.parseTask);
  }
}
