import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

const SurvivalProbabilityForm = () => {
  const [formData, setFormData] = useState({
    Water_pH: "",
    Dissolved_Oxygen_mg_L: "",
    Temperature_C: "",
    Shrimp_Weight_g: "",
    Adjusted_FCR: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict-survival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Prediction failed");
      }
    } catch (err) {
      setError("Error connecting to the backend");
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#333", borderRadius: 2 }}>
      <Typography variant="h6" sx={{ color: "#FFD700", mb: 2 }}>
        Survival Probability Calculator
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="Water_pH"
          label="Water pH"
          value={formData.Water_pH}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { color: "#FFFFFF" } }}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
        />
        <TextField
          name="Dissolved_Oxygen_mg_L"
          label="Dissolved Oxygen (mg/L)"
          value={formData.Dissolved_Oxygen_mg_L}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { color: "#FFFFFF" } }}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
        />
        <TextField
          name="Temperature_C"
          label="Temperature (°C)"
          value={formData.Temperature_C}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { color: "#FFFFFF" } }}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
        />
        <TextField
          name="Shrimp_Weight_g"
          label="Shrimp Weight (g)"
          value={formData.Shrimp_Weight_g}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { color: "#FFFFFF" } }}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
        />
        <TextField
          name="Adjusted_FCR"
          label="Adjusted FCR"
          value={formData.Adjusted_FCR}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ style: { color: "#FFFFFF" } }}
          InputLabelProps={{ style: { color: "#FFFFFF" } }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "#FFD700", color: "#424242" }}>
          Predict
        </Button>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {result && (
        <Box sx={{ mt: 2, color: "#FFFFFF" }}>
          <Typography>Survival Prediction: {result.survival_prediction}</Typography>
          <Typography>Probability: {(result.probability * 100).toFixed(2)}%</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SurvivalProbabilityForm;