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

const ShrimpGrowthChart = ({ data, selectedSpecies }) => {
  const filteredData = selectedSpecies
    ? data.filter((item) => item.Shrimp_Species === selectedSpecies)
    : data;

  const sortedData = [...filteredData].sort((a, b) => Number(a.Age_of_Shrimp_days) - Number(b.Age_of_Shrimp_days));

  console.log("Chart data received:", sortedData);

  const labels = sortedData.map((item) => Number(item.Age_of_Shrimp_days));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Average Shrimp Weight (g)",
        data: sortedData.map((item) => Number(item.Shrimp_Weight_g) || 0),
        borderColor: "#00BCD4", // Cyan for better visibility
        backgroundColor: "#00BCD4",
        fill: false,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#00BCD4",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#FFFFFF", font: { size: 14 } } },
      title: {
        display: true,
        text: `Weight of the Shrimp Over Age${selectedSpecies ? ` (${selectedSpecies})` : ""}`,
        font: { size: 18 },
        color: "#FFFFFF",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value} g`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Weight (g)", color: "#FFFFFF", font: { size: 14 } },
        ticks: { color: "#FFFFFF" },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Light grid lines for better readability
        },
      },
      x: {
        title: { display: true, text: "Age of Shrimp (days)", color: "#FFFFFF", font: { size: 14 } },
        ticks: { color: "#FFFFFF" },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      {sortedData.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <p style={{ color: "#FFFFFF", textAlign: "center" }}>
          No data available for {selectedSpecies || "the selected species"}.
        </p>
      )}
    </div>
  );
};

export default ShrimpGrowthChart;