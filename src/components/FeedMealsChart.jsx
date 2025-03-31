import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from "chart.js";
import { Typography, Box } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

function FeedMealsChart({ data, selectedSpecies }) {
  const filteredData = selectedSpecies ? data.filter((d) => d.Shrimp_Species === selectedSpecies) : data;

  const feedTypes = [...new Set(filteredData.map((d) => d.Feed_Type || "Unknown"))];
  const species = selectedSpecies ? [selectedSpecies] : [...new Set(filteredData.map((d) => d.Shrimp_Species))];

  const datasets = species.map((sp) => {
    const costs = feedTypes.map((type) => {
      const typeData = filteredData.filter((d) => (d.Feed_Type || "Unknown") === type && d.Shrimp_Species === sp);
      return typeData.length ? (typeData.reduce((sum, d) => sum + (d.Feed_Cost_per_Kg_USD || 0), 0) / typeData.length).toFixed(2) : 0;
    });
    return {
      label: sp,
      data: costs,
      backgroundColor: sp === "P. monodon" ? "#FFCA28" : sp === "M. rosenbergii" ? "#4CAF50" : "#0288D1",
      borderColor: "#E0F7FA",
      borderWidth: 1,
    };
  });

  const chartData = { labels: feedTypes, datasets };

  const options = {
    responsive: true,
    plugins: { 
      legend: { labels: { color: "#E0F7FA" } }, 
      title: { display: true, text: "Average Feed Cost by Type and Species", color: "#E0F7FA" } 
    },
    scales: { 
      y: { beginAtZero: true, title: { display: true, text: "Cost (USD/kg)", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } }, 
      x: { title: { display: true, text: "Feed Type", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } } 
    },
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ color: "#E0F7FA", mb: 2 }}>Feed Cost Chart</Typography>
      <Bar data={chartData} options={options} />
    </Box>
  );
}

export default FeedMealsChart;