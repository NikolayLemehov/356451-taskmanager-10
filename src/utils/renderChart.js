import {getIsOneDay} from "./common";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import {Color} from "../const";

const ColorValue = {
  [Color.BLACK]: `#000000`,
  [Color.BLUE]: `#0c5cdd`,
  [Color.GREEN]: `#31b55c`,
  [Color.PINK]: `#ff3cb9`,
  [Color.YELLOW]: `#ffe125`,
};

const calcUniqCountColor = (tasks, color) => tasks.filter((it) => it.color === color).length;
const calculateBetweenDates = (from, to) => {
  const result = [];
  let date = new Date(from);

  while (date <= to) {
    result.push(date);

    date = new Date(date);
    date.setDate(date.getDate() + 1);
  }

  return result;
};
const createRandomColor = () => {
  const value = Math.floor(Math.random() * 0xffffff);

  return `#${value.toString(16)}`;
};

const renderColorsChart = (colorsCtx, tasks) => {
  const colors = tasks
    .map((task) => task.color)
    .filter((it, i, arr) => arr.indexOf(it) === i);

  return new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: colors,
      datasets: [{
        data: colors.map((color) => calcUniqCountColor(tasks, color)),
        backgroundColor: colors.map((color) => ColorValue[color])
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const renderDaysChart = (daysCtx, tasks, dateFrom, dateTo) => {
  const days = calculateBetweenDates(dateFrom, dateTo);

  const taskCountOnDay = days.map((date) => tasks.filter((task) => getIsOneDay(task.dueDate, date)).length);

  const formattedDates = days.map((it) => moment(it).format(`DD MMM`));

  return new Chart(daysCtx, {
    plugins: [ChartDataLabels],
    type: `line`,
    data: {
      labels: formattedDates,
      datasets: [{
        data: taskCountOnDay,
        backgroundColor: `transparent`,
        borderColor: `#000000`,
        borderWidth: 1,
        lineTension: 0,
        pointRadius: 8,
        pointHoverRadius: 8,
        pointBackgroundColor: `#000000`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 8
          },
          color: `#ffffff`
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            fontStyle: `bold`,
            fontColor: `#000000`
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 10
        }
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const renderTagsChart = (tagsCtx, tasks) => {
  const tagsLabels = tasks.map((task) => task.tags)
    .reduce((acc, tags) => {
      return acc.concat(Array.from(tags));
    }, [])
    .filter((it, i, arr) => arr.indexOf(it) === i);

  return new Chart(tagsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: tagsLabels,
      datasets: [{
        data: tagsLabels.map((tag) => tasks.reduce((acc, task) => {
          const targetTasksCount = Array.from(task.tags)
            .filter((it) => it === tag).length;

          return acc + targetTasksCount;
        }, 0)),
        backgroundColor: tagsLabels.map(createRandomColor)
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];

            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);

            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: TAGS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

export {renderColorsChart, renderDaysChart, renderTagsChart};
