export default class TaskAdapterModel {
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

  getRAW() {
    return {
      'id': this.id,
      'description': this.description,
      'color': this.color,
      'tags': Array.from(this.tags),
      'due_date': this.dueDate ? this.dueDate.toISOString() : null,
      'repeating_days': this.repeatingDays,
      'is_favorite': this.isFavorite,
      'is_archived': this.isArchive,
    };
  }

  static parseTask(endData) {
    return new TaskAdapterModel(endData);
  }

  static parseTasks(endData) {
    return endData.map(TaskAdapterModel.parseTask);
  }

  static clone(taskAdapterModel) {
    return new TaskAdapterModel(taskAdapterModel.getRAW());
  }
}
