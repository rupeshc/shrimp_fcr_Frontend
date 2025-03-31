import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, TimeScale, Tooltip, Legend, Title } from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(CategoryScale, LinearScale, BarElement, TimeScale, Tooltip, Legend, Title);

const Visualization = ({ type, data, labels, options = {}, timeSeries = false }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div style={{ color: "#E0F7FA" }}>No data available to display.</div>;
  }

  const prepareData = () => {
    if (timeSeries && data.every(item => item && typeof item === "object" && "date" in item && "value" in item)) {
      return {
        labels: data.map(item => item.date),
        datasets: [
          {
            label: type === "survivalRate" ? "Survival Rate (%)" : "Yield (kg)",
            data: data.map(item => item.value),
            backgroundColor: type === "survivalRate"
              ? ["#4CAF50", "#81C784", "#A5D6A7"]
              : ["#FF9800", "#FFB74D", "#FFCC80"],
            borderColor: "#FFFFFF",
            borderWidth: 1,
            barThickness: 20,
          },
        ],
      };
    } else {
      return {
        labels: labels || [],
        datasets: [
          {
            label: type === "survivalRate" ? "Survival Rate (%)" : "Yield (kg)",
            data,
            backgroundColor: type === "survivalRate"
              ? ["#4CAF50", "#81C784", "#A5D6A7"]
              : ["#FF9800", "#FFB74D", "#FFCC80"],
            borderColor: "#FFFFFF",
            borderWidth: 1,
            barThickness: 20,
          },
        ],
      };
    }
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#E0F7FA" } },
      title: {
        display: true,
        text: type === "survivalRate" ? "Shrimp Survival Rate" : "Shrimp Yield Prediction",
        color: "#B2EBF2",
        font: { size: 18, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${context.dataset.label}: ${value}${type === "survivalRate" ? "%" : " kg"}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: type === "survivalRate" ? "Survival Rate (%)" : "Yield (kg)",
          color: "#B0BEC5",
        },
        ticks: { color: "#E0F7FA" },
      },
      x: {
        ticks: { color: "#E0F7FA" },
        type: timeSeries ? "time" : "category",
        time: timeSeries ? {
          unit: "day",
          displayFormats: { day: "MMM d" },
          tooltipFormat: "MMM d, yyyy",
        } : undefined,
      },
    },
  };

  const finalOptions = { ...defaultOptions, ...options };
  const chartData = prepareData();

  return <Bar data={chartData} options={finalOptions} />;
};

export default Visualization;