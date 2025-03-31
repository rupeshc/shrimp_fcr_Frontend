import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const ModelInsightsPage = () => {
  const [data, setData] = useState({ water: [], growth: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [waterResponse, growthResponse] = await Promise.all([
          fetch("http://127.0.0.1:5000/api/water-quality?limit=200"),
          fetch("http://127.0.0.1:5000/api/shrimp-growth?limit=200"),
        ]);
        const [waterData, growthData] = await Promise.all([
          waterResponse.json(),
          growthResponse.json(),
        ]);
        setData({ water: waterData, growth: growthData });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data for model insights:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Typography color="#E0F7FA">Loading...</Typography>;

  // Mock ML Model: Predict Shrimp Size based on Water pH (simplified linear regression simulation)
  const scatterData = data.water.map((waterItem, index) => {
    const growthItem = data.growth[index] || {};
    const pH = waterItem.Water_pH || 0;
    const shrimpSize = growthItem.Shrimp_Size_g || 0;
    // Mock prediction: Shrimp Size = 2 * pH + noise
    const predictedSize = 2 * pH + (Math.random() * 2 - 1); // Add noise for simulation
    return { actual: { x: pH, y: shrimpSize }, predicted: { x: pH, y: predictedSize } };
  });

  const chartData = {
    datasets: [
      {
        label: "Actual Shrimp Size",
        data: scatterData.map((d) => d.actual),
        backgroundColor: "#FF6B6B",
      },
      {
        label: "Predicted Shrimp Size",
        data: scatterData.map((d) => d.predicted),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#E0F7FA" } },
      title: {
        display: true,
        text: "Shrimp Size vs Water pH (ML Prediction)",
        font: { size: 18 },
        color: "#E0F7FA",
      },
    },
    scales: {
      x: { title: { display: true, text: "Water pH", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
      y: { title: { display: true, text: "Shrimp Size (g)", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
    },
  };

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: "#1A2A44", color: "#E0F7FA" }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Model Insights
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, textAlign: "center" }}>
        This section uses a machine learning model to predict shrimp size based on water pH.
      </Typography>
      <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
        <Scatter data={chartData} options={options} />
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

export default ModelInsightsPage;