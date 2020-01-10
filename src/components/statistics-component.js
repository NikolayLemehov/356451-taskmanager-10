import moment from "moment";
import flatpickr from "flatpickr";
import AbstractSmartComponent from './abstract-smart-component.js';
import {renderColorsChart, renderDaysChart, renderTagsChart} from "../utils/renderChart";

const filterTasksByDateRange = (tasks, dateFrom, dateTo) => {
  return tasks.filter((task) => task.dueDate >= dateFrom && task.dueDate <= dateTo);
};

const createPlaceholder = (dateFrom, dateTo) => {
  const format = (date) => moment(date).format(`DD MMM`);
  return `${format(dateFrom)} - ${format(dateTo)}`;
};

const createStatisticsTemplate = ({tasks, dateFrom, dateTo}) => {
  const placeholder = createPlaceholder(dateFrom, dateTo);
  const tasksCount = filterTasksByDateRange(tasks, dateFrom, dateTo).length;
  return (
    `<section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input class="statistic__period-input" type="text" placeholder="${placeholder}">
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">${tasksCount}</span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__tags-wrap">
          <canvas class="statistic__tags" width="400" height="300"></canvas>
        </div>
        <div class="statistic__colors-wrap">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </section>`
  );
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor({tasksModel, dateFrom, dateTo}) {
    super();

    this._tasksModel = tasksModel;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    this._daysChart = null;
    this._tagsChart = null;
    this._colorsChart = null;

    this._applyFlatpickr(this.getElement().querySelector(`.statistic__period-input`));

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate({tasks: this._tasksModel.getTasks(), dateFrom: this._dateFrom, dateTo: this._dateTo});
  }

  show() {
    super.show();

    this.rerender(this._tasksModel, this._dateFrom, this._dateTo);
  }

  recoveryListeners() {}

  rerender(tasksModel, dateFrom, dateTo) {
    this._tasksModel = tasksModel;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    this._applyFlatpickr(this.getElement().querySelector(`.statistic__period-input`));

    const daysCtx = element.querySelector(`.statistic__days`);
    const tagsCtx = element.querySelector(`.statistic__tags`);
    const colorsCtx = element.querySelector(`.statistic__colors`);

    this._resetCharts();

    this._daysChart = renderDaysChart(daysCtx, this._tasksModel.getTasks(), this._dateFrom, this._dateTo);
    this._tagsChart = renderTagsChart(tagsCtx, this._tasksModel.getTasks());
    this._colorsChart = renderColorsChart(colorsCtx, this._tasksModel.getTasks());
  }

  _resetCharts() {
    if (this._daysChart) {
      this._daysChart.destroy();
      this._daysChart = null;
    }

    if (this._tagsChart) {
      this._tagsChart.destroy();
      this._tagsChart = null;
    }

    if (this._colorsChart) {
      this._colorsChart.destroy();
      this._colorsChart = null;
    }
  }

  _applyFlatpickr(element) {
    if (this._flatpickr) {
      this._flatpickr.destroy();
    }

    this._flatpickr = flatpickr(element, {
      defaultDate: [this._dateFrom, this._dateTo],
      dateFormat: `d M`,
      mode: `range`,
      onChange: (dates) => {
        if (dates.length === 2) {
          this.rerender(this._tasksModel, dates[0], dates[1]);
        }
      }
    });
  }
}
