
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const YieldPredictionChart = ({ data, selectedSpecies }) => {
  const filteredData = selectedSpecies
    ? data.filter((item) => item.Shrimp_Species === selectedSpecies)
    : data;

  const sortedData = [...filteredData].sort((a, b) => a.Age_of_Shrimp_days - b.Age_of_Shrimp_days);

  const labels = sortedData.map((item) => item.Age_of_Shrimp_days);
  const yieldData = sortedData.map((item) => item.Harvest_Yield_Prediction_kg_ha || 1000);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Harvest Yield (kg/ha)",
        data: yieldData,
        backgroundColor: "#FF4500",
        borderColor: "#FF4500",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#FFFFFF", font: { size: 14 } } },
      title: {
        display: true,
        text: `Harvest Yield Prediction Over Age${selectedSpecies ? ` (${selectedSpecies})` : ""}`,
        font: { size: 18 },
        color: "#FFFFFF",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value} kg/ha`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Yield (kg/ha)", color: "#FFFFFF", font: { size: 14 } },
        ticks: { color: "#FFFFFF" },
      },
      x: {
        title: { display: true, text: "Age of Shrimp", color: "#FFFFFF", font: { size: 14 } },
        ticks: { color: "#FFFFFF" },
      },
    },
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      {sortedData.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p style={{ color: "#FFFFFF", textAlign: "center" }}>
          No data available for {selectedSpecies || "the selected species"}.
        </p>
      )}
    </div>
  );
};

export default YieldPredictionChart;