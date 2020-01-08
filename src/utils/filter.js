import {getIsOneDay, getIsOverdueDate} from './common.js';
import {FilterType} from '../const.js';

const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return getIsOverdueDate(dueDate, date);
  });
};

const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => Object.values(task.repeatingDays).some(Boolean));
};

const getTasksWithHashtags = (tasks) => {
  return tasks.filter((task) => task.tags.size);
};

const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => getIsOneDay(task.dueDate, date));
};

const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchiveTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FilterType.TAGS:
      return getTasksWithHashtags(getNotArchiveTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
  }

  return tasks;
};

export {getTasksByFilter};
