import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Title);

const WaterQualityTrendsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/water-quality?limit=200");
        const waterData = await response.json();
        setData(waterData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching water quality data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Typography color="#E0F7FA">Loading...</Typography>;

  const pHTrendData = data.map((item, index) => ({
    x: index + 1,
    y: item.Water_pH || 0,
  }));

  const chartData = {
    labels: pHTrendData.map((_, index) => `Record ${index + 1}`),
    datasets: [
      {
        label: "Water pH Trend",
        data: pHTrendData.map((d) => d.y),
        fill: false,
        borderColor: "#0288D1",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#E0F7FA" } },
      title: {
        display: true,
        text: "Water pH Trend Over Time",
        font: { size: 18 },
        color: "#E0F7FA",
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "pH Value", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
      x: { title: { display: true, text: "Record Number", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
    },
  };

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: "#1A2A44", color: "#E0F7FA" }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Water Quality Trends
      </Typography>
      <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
        <Line data={chartData} options={options} />
      </Box>
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/menu")}
          sx={{
            fontWeight: "bold",
            color: "#E0F7FA",
            borderColor: "#4CAF50",
          }}
        >
          Back to Menu
        </Button>
      </Box>
    </Box>
  );
};

export default WaterQualityTrendsPage;