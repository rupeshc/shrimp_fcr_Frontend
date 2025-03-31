import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Visualization from "./Visualization";

const ShrimpHealthYieldPage = ({ data, recordsFilter, selectedSpecies, pondAreaRange }) => {
  const [predictionData, setPredictionData] = useState({
    waterTemp: "",
    salinity: "",
    phLevel: "",
    oxygenLevel: "",
    pondArea: "",
  });
  const [yieldPrediction, setYieldPrediction] = useState(null);
  const [survivalProbability, setSurvivalProbability] = useState(null);
  const [timeGranularity, setTimeGranularity] = useState("daily");

  // Process raw data into time series format
  const processData = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { survival: [], yield: [] };
    }

    const groupedData = data.reduce((acc, item) => {
      // Handle missing or invalid date
      const dateStr = item.date || item.timestamp;
      if (!dateStr) return acc;

      let date;
      try {
        date = new Date(dateStr).toISOString().split("T")[0];
      } catch (error) {
        console.warn(`Invalid date format for item:`, item);
        return acc;
      }

      if (!acc[date]) acc[date] = { survival: [], yield: [] };
      acc[date].survival.push(Number(item.survival_rate) || 0);
      acc[date].yield.push(Number(item.yield) || 0);
      return acc;
    }, {});

    const aggregate = (values) => (timeGranularity === "weekly" ? averageWeekly(values) : averageDaily(values));

    return {
      survival: Object.entries(groupedData)
        .map(([date, values]) => ({
          date,
          value: aggregate(values.survival),
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)), // Sort by date
      yield: Object.entries(groupedData)
        .map(([date, values]) => ({
          date,
          value: aggregate(values.yield),
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    };
  };

  const averageDaily = (values) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

  const averageWeekly = (values) => {
    if (!values.length) return 0;
    const weekly = {};
    values.forEach((value, index) => {
      const week = Math.floor(index / 7);
      weekly[week] = weekly[week] ? weekly[week] + value : value;
    });
    const weeks = Object.keys(weekly).length;
    return weeks ? Object.values(weekly).reduce((a, b) => a + b, 0) / weeks : 0;
  };

  const processedData = processData();

  // Handle prediction form submission
  const handlePrediction = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict-health-yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...predictionData,
          species: selectedSpecies,
          pond_area_range: pondAreaRange,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setYieldPrediction(result.yield_prediction || 0);
        setSurvivalProbability(result.survival_probability || 0);
      } else {
        console.error("Prediction failed:", result.error);
      }
    } catch (err) {
      console.error("Error fetching prediction:", err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setPredictionData({ ...predictionData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#E0F7FA", mb: 4 }}>
        Shrimp Health & Yield Insights
      </Typography>

      {/* Charts Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 400, position: "relative" }}>
            <Visualization
              type="survivalRate"
              data={processedData.survival}
              timeSeries={true}
              options={{ scales: { y: { max: 100 } } }} // Cap survival rate at 100%
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 400, position: "relative" }}>
            <Visualization
              type="yieldPrediction"
              data={processedData.yield}
              timeSeries={true}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Time Granularity Selector */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Granularity</InputLabel>
          <Select
            value={timeGranularity}
            onChange={(e) => setTimeGranularity(e.target.value)}
            sx={{ color: "#E0F7FA", ".MuiSelect-icon": { color: "#E0F7FA" } }}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Prediction Forms Section */}
      <Typography variant="h5" gutterBottom sx={{ color: "#B2EBF2", mb: 3 }}>
        Predictive Analysis
      </Typography>
      <Box
        component="form"
        onSubmit={handlePrediction}
        sx={{ backgroundColor: "#1E3553", p: 3, borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Water Temperature (°C)"
              name="waterTemp"
              value={predictionData.waterTemp}
              onChange={handleChange}
              type="number"
              InputLabelProps={{ style: { color: "#B0BEC5" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salinity (ppt)"
              name="salinity"
              value={predictionData.salinity}
              onChange={handleChange}
              type="number"
              InputLabelProps={{ style: { color: "#B0BEC5" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="pH Level"
              name="phLevel"
              value={predictionData.phLevel}
              onChange={handleChange}
              type="number"
              InputLabelProps={{ style: { color: "#B0BEC5" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Oxygen Level (mg/L)"
              name="oxygenLevel"
              value={predictionData.oxygenLevel}
              onChange={handleChange}
              type="number"
              InputLabelProps={{ style: { color: "#B0BEC5" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pond Area (m²)"
              name="pondArea"
              value={predictionData.pondArea}
              onChange={handleChange}
              type="number"
              InputLabelProps={{ style: { color: "#B0BEC5" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              sx={{ backgroundColor: "#0288D1", color: "#FFFFFF", "&:hover": { backgroundColor: "#01579B" } }}
            >
              Predict
            </Button>
          </Grid>
        </Grid>

        {/* Prediction Results */}
        {(yieldPrediction !== null || survivalProbability !== null) && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: "#152238", borderRadius: 2 }}>
            <Typography sx={{ color: "#E0F7FA" }}>
              Predicted Yield: {yieldPrediction !== null ? `${yieldPrediction} kg` : "N/A"}
            </Typography>
            <Typography sx={{ color: "#E0F7FA" }}>
              Survival Probability: {survivalProbability !== null ? `${survivalProbability}%` : "N/A"}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ShrimpHealthYieldPage;