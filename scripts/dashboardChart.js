import { fetchData } from "./index.js";

const ctx = document.getElementById("dashboard-chart").getContext("2d");
const sumEl = document.getElementById('sum');
Chart.register(ChartDataLabels);

const dataValues = await fetchData();
let chartData = {
  "food": 0,
  "rent": 0,
  "transport": 0,
  "shopping": 0,
  "other": 0
};

if(!dataValues) {
  console.error("Could not fetch data");
} else {
  dataValues.forEach(row => {
    chartData[row.category] += parseFloat(row.amount);
  });
}

console.log(chartData);

// User Configs
let chartType = "pie";
let colorPalette = ["green", "red", "orange", "purple", "blue"];
let borderWidth = 0.8
let showLegend = false;
let legendPosition = "bottom";
let dataLabelColor = "#f8f9fa";
let dataLabelFontSize = 13;
let dataLabelFontWeight = "bold";

const data = {
  labels: Object.keys(chartData),
  datasets: [
    {
      label: "$",
      backgroundColor: colorPalette,
      data: Object.values(chartData),
      borderWidth: borderWidth,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: showLegend,
      position: legendPosition,
    },
    tooltip: {
      enabled: true, 
    },
    datalabels: {
      formatter: (value, ctx) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;        
        dataArr.map(data => {
          if(parseFloat(data) != 0){
            sum += parseFloat(data);
          }
        });
        let percentage = (value * 100 / sum).toFixed(1) + "%";
        sumEl.innerText = sum;
        if (sum <= 0) {
          percentage = "No data";
        } else if(percentage === "0.0%"){
          percentage = "";
        }
        return percentage;
      },
      color: dataLabelColor,
      font: {
        size: dataLabelFontSize,
        weight: dataLabelFontWeight
      },
    },
  },
};

const config = {
  type: chartType,
  data: data,
  options: options,
  plugins: [ChartDataLabels],
};

new Chart(ctx, config);
