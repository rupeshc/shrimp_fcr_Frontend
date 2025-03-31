import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WaterQualityChart = ({ data, selectedSpecies }) => {
  const filteredData = selectedSpecies
    ? data.filter((item) => item.Shrimp_Species === selectedSpecies)
    : data;

  const labels = filteredData.map((_, index) => `Record ${index + 1}`);

  const parameters = [
    "Water_pH",
    "Temperature_C",
    "Salinity_ppt",
    "Dissolved_Oxygen_mg_L",
    "Ammonia_mg_L",
    "Nitrite_mg_L",
    "Alkalinity_mg_L_CaCO3",
  ];

  const colors = [
    "#FF0000", // Red
    "#FFFF00", // Yellow
    "#00FFFF", // Cyan
    "#FF00FF", // Magenta
    "#00FF00", // Lime
    "#FFA500", // Orange
    "#0000FF", // Blue
  ];

  const datasets = parameters.map((param, index) => {
    return {
      label: param.replace(/_/g, " "),
      data: filteredData.map((item) => item[param]),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      fill: false,
      tension: 0.1,
      pointRadius: 5,
      pointHoverRadius: 8,
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#FFFFFF" },
      },
      title: {
        display: true,
        text: "Water Quality Parameters Over Records",
        font: { size: 18 },
        color: "#FFFFFF",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Value", color: "#FFFFFF" },
        ticks: { color: "#FFFFFF" },
      },
      x: {
        title: { display: true, text: "Record", color: "#FFFFFF" },
        ticks: { color: "#FFFFFF" },
      },
    },
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WaterQualityChart;