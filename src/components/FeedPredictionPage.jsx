import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";

function FeedPredictionPage() {
  const [formData, setFormData] = useState({
    Water_pH: "",
    Dissolved_Oxygen_mg_L: "",
    Temperature_C: "",
    Shrimp_Weight_g: "",
    Adjusted_FCR: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const limits = {
    Water_pH: { min: 6.5, max: 9.0, label: "Water pH (6.5-9.0)" },
    Dissolved_Oxygen_mg_L: { min: 3.0, max: 10.0, label: "Dissolved Oxygen (3.0-10.0 mg/L)" },
    Temperature_C: { min: 20.0, max: 35.0, label: "Temperature (20.0-35.0 °C)" },
    Shrimp_Weight_g: { min: 1.0, max: 50.0, label: "Shrimp Weight (1.0-50.0 g)" },
    Adjusted_FCR: { min: 0.5, max: 3.0, label: "Adjusted FCR (0.5-3.0)" },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    const limit = limits[name];
    setFormData({ ...formData, [name]: value });
    if (value !== "" && (numValue < limit.min || numValue > limit.max)) {
      setError(`${limit.label} must be between ${limit.min} and ${limit.max}.`);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const values = Object.entries(formData).map(([key, val]) => ({ key, value: parseFloat(val) }));
    if (values.some(({ value }) => isNaN(value) || value <= 0)) {
      setError("All fields must be positive numbers within valid ranges.");
      return;
    }
    for (const { key, value } of values) {
      const limit = limits[key];
      if (value < limit.min || value > limit.max) {
        setError(`${limit.label} must be between ${limit.min} and ${limit.max}.`);
        return;
      }
    }

    try {
      const payload = Object.fromEntries(values.map(({ key, value }) => [key, value]));
      const response = await fetch("http://127.0.0.1:5000/api/predict-feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Failed to predict feed consumption: ${err.message}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `
          linear-gradient(135deg, #4CAF50 0%, #0288D1 100%),
          url('https://www.transparenttextures.com/patterns/paper-fibers.png')
        `,
        backgroundSize: "cover, 200px",
        backgroundRepeat: "no-repeat, repeat",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          p: 4,
          backgroundColor: "rgba(30, 53, 83, 0.9)",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          zIndex: 2,
          color: "#E0F7FA",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#E0F7FA", textShadow: "1px 1px 4px rgba(0, 0, 0, 0.5)" }}>
          Feed Prediction
        </Typography>
        <Typography sx={{ color: "#E0F7FA", mb: 2 }}>
          <strong>Definition:</strong> Feed prediction estimates the daily feed consumption (in grams) required for shrimp based on environmental and feed conditions. FCR (Feed Conversion Ratio) is the efficiency ratio of feed input to weight gain, typically ranging from 0.5 to 3.0.
        </Typography>
        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([name]) => (
            <TextField
              key={name}
              label={limits[name].label}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              type="number"
              step="0.01"
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ style: { color: "#E0F7FA" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#E0F7FA" } } }}
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#0288D1", "&:hover": { backgroundColor: "#4CAF50" }, transition: "border-color 0.25s" }}
          >
            Predict Feed
          </Button>
        </form>
        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: "#E0F7FA" }}>
              Predicted Feed Consumption: {result.predicted_feed_consumption_g} {result.unit}
            </Typography>
            <Typography sx={{ color: "#E0F7FA", mt: 2 }}>
              <strong>What We Predicted:</strong> The daily feed consumption (in grams) for shrimp based on your input.
            </Typography>
            <Typography sx={{ color: "#E0F7FA" }}>
              <strong>How We Predicted:</strong> Using a Linear Regression model trained on historical shrimp farming data, scaled with StandardScaler for normalization.
            </Typography>
            <Typography sx={{ color: "#E0F7FA" }}>
              <strong>What We Used:</strong> Water pH, Dissolved Oxygen, Temperature, Shrimp Weight, and Adjusted FCR from your input, processed against a pre-trained model.
            </Typography>
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mt: 2, color: "#FF6B6B" }}>{error}</Alert>}
      </Box>
    </Box>
  );
}

export default FeedPredictionPage;