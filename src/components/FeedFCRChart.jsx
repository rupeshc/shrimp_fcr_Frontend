import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const FeedFCRChart = ({ data, selectedSpecies }) => {
  const filteredData = selectedSpecies
    ? data.filter((item) => item.Shrimp_Species === selectedSpecies)
    : data;

  // Define pond area groups dynamically
  const pondAreaGroups = [
    {
      label: "Below 500 m²",
      data: filteredData.filter((item) => item.Pond_Area_m2 < 500),
    },
    {
      label: "500–1,000 m²",
      data: filteredData.filter((item) => item.Pond_Area_m2 >= 500 && item.Pond_Area_m2 <= 1000),
    },
    {
      label: "Above 1,000 m²",
      data: filteredData.filter((item) => item.Pond_Area_m2 > 1000),
    },
  ];

  // Compute averages and filter out empty groups
  const averages = pondAreaGroups.map((group) =>
    group.data.length > 0
      ? group.data.reduce((sum, item) => sum + (item.Adjusted_FCR || 0), 0) / group.data.length
      : 0
  );

  // Filter labels and data together to keep them in sync
  const validGroups = pondAreaGroups.filter((_, index) => averages[index] > 0);
  const barData = {
    labels: validGroups.map((group) => group.label),
    datasets: [
      {
        label: "Average Adjusted FCR",
        data: averages.filter((value) => value > 0),
        backgroundColor: ["#FF0000", "#00FF00", "#FFA500"], // Bright Red, Lime, Orange
        borderColor: "#FFFFFF",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#FFFFFF" },
      },
      title: {
        display: true,
        text: "Average Adjusted FCR by Pond Area",
        font: { size: 16 },
        color: "#FFFFFF",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: "Average FCR", color: "#FFFFFF" },
        ticks: { color: "#FFFFFF" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        title: { display: true, text: "Pond Area Range", color: "#FFFFFF" },
        ticks: { color: "#FFFFFF" },
      },
    },
    barPercentage: 0.5,
    categoryPercentage: 0.8,
  };

  return (
    <div style={{ marginBottom: "40px", marginTop: "40px", height: "300px" }}>
      <Bar data={barData} options={options} />
    </div>
  );
};

export default FeedFCRChart;