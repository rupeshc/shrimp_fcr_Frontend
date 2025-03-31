import React, { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ShrimpYieldPredictionPage = () => {
  const [waterPH, setWaterPH] = useState("");
  const [dissolvedOxygen, setDissolvedOxygen] = useState("");
  const [temperature, setTemperature] = useState("");
  const [shrimpWeight, setShrimpWeight] = useState("");
  const [adjustedFCR, setAdjustedFCR] = useState("");
  const [totalFeed, setTotalFeed] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [suggestedFeed, setSuggestedFeed] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePredict = async () => {
    setError(null);
    setPrediction(null);
    setSuggestedFeed(null);

    // Basic input validation
    if (!waterPH || !dissolvedOxygen || !temperature || !shrimpWeight || !adjustedFCR || !totalFeed) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict-yield-optimization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Water_pH: parseFloat(waterPH),
          Dissolved_Oxygen_mg_L: parseFloat(dissolvedOxygen),
          Temperature_C: parseFloat(temperature),
          Shrimp_Weight_g: parseFloat(shrimpWeight),
          Adjusted_FCR: parseFloat(adjustedFCR),
          Total_Feed_Consumed_per_Day_g: parseFloat(totalFeed),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setPrediction(result.predicted_yield_kg_ha);
        setSuggestedFeed(result.suggested_feed_consumption_g);
        setError(null);
      } else {
        setError(result.error || "Failed to predict yield");
      }
    } catch (err) {
      setError("Error connecting to backend");
      console.error(err);
    }
  };

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: "#424242", color: "#FFFFFF" }}>
      <Typography variant="h4" sx={{ mb: 2, color: "#FFD700", textAlign: "center" }}>
        Shrimp Yield Prediction
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400, mx: "auto" }}>
        <TextField
          label="Water pH"
          type="number"
          value={waterPH}
          onChange={(e) => setWaterPH(e.target.value)}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
          InputProps={{ style: { color: "#FFFFFF" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FFFFFF" } } }}
        />
        <TextField
          label="Dissolved Oxygen (mg/L)"
          type="number"
          value={dissolvedOxygen}
          onChange={(e) => setDissolvedOxygen(e.target.value)}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
          InputProps={{ style: { color: "#FFFFFF" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FFFFFF" } } }}
        />
        <TextField
          label="Temperature (°C)"
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
          InputProps={{ style: { color: "#FFFFFF" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FFFFFF" } } }}
        />
        <TextField
          label="Shrimp Weight (g)"
          type="number"
          value={shrimpWeight}
          onChange={(e) => setShrimpWeight(e.target.value)}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
          InputProps={{ style: { color: "#FFFFFF" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FFFFFF" } } }}
        />
        <TextField
          label="Adjusted FCR"
          type="number"
          value={adjustedFCR}
          onChange={(e) => setAdjustedFCR(e.target.value)}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
          InputProps={{ style: { color: "#FFFFFF" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FFFFFF" } } }}
        />
        <TextField
          label="Total Feed Consumed per Day (g)"
          type="number"
          value={totalFeed}
          onChange={(e) => setTotalFeed(e.target.value)}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
          InputProps={{ style: { color: "#FFFFFF" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#FFFFFF" } } }}
        />
        <Button
          variant="contained"
          onClick={handlePredict}
          sx={{ backgroundColor: "#0288D1", "&:hover": { backgroundColor: "#4CAF50" } }}
        >
          Predict Yield
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {prediction !== null && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "#FFD700" }}>
              Predicted Yield: {prediction.toFixed(2)} kg/ha
            </Typography>
            <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
              Suggested Feed Consumption: {suggestedFeed.toFixed(2)} g/day
            </Typography>
          </Box>
        )}
        <Button
          variant="outlined"
          onClick={() => navigate("/menu")}
          sx={{
            mt: 2,
            color: "#FFFFFF",
            borderColor: "#4CAF50",
            "&:hover": { borderColor: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.1)" },
          }}
        >
          Back to Menu
        </Button>
      </Box>
    </Box>
  );
};

export default ShrimpYieldPredictionPage;