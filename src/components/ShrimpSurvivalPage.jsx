import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";

const ShrimpSurvivalPage = () => {
  const [waterPH, setWaterPH] = useState("");
  const [dissolvedOxygen, setDissolvedOxygen] = useState("");
  const [temperature, setTemperature] = useState("");
  const [shrimpWeight, setShrimpWeight] = useState("");
  const [adjustedFCR, setAdjustedFCR] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionTime, setPredictionTime] = useState(null); // For timestamp
  const navigate = useNavigate();

  // Realistic ranges for shrimp farming
  const VALID_RANGES = {
    waterPH: { min: 6.5, max: 9.0, label: "Water pH", optimalMin: 7.0, optimalMax: 8.5 },
    dissolvedOxygen: { min: 3.0, max: 8.0, label: "Dissolved Oxygen (mg/L)", optimalMin: 5.0, optimalMax: 8.0 },
    temperature: { min: 20.0, max: 35.0, label: "Temperature (°C)", optimalMin: 26.0, optimalMax: 32.0 },
    shrimpWeight: { min: 0.1, max: 50.0, label: "Shrimp Weight (g)", optimalMin: 0.1, optimalMax: 50.0 },
    adjustedFCR: { min: 0.5, max: 3.0, label: "Adjusted FCR", optimalMin: 1.0, optimalMax: 2.0 },
  };

  const validateInput = (value, field) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return `${field.label} must be a valid number.`;
    if (numValue < field.min || numValue > field.max)
      return `${field.label} must be between ${field.min} and ${field.max}.`;
    return null;
  };

  // Function to identify suboptimal inputs and provide recommendations
  const getSuboptimalInputs = () => {
    const inputs = [
      { value: waterPH, field: VALID_RANGES.waterPH },
      { value: dissolvedOxygen, field: VALID_RANGES.dissolvedOxygen },
      { value: temperature, field: VALID_RANGES.temperature },
      { value: shrimpWeight, field: VALID_RANGES.shrimpWeight },
      { value: adjustedFCR, field: VALID_RANGES.adjustedFCR },
    ];

    const issues = [];
    const recommendations = [];

    inputs.forEach(({ value, field }) => {
      const numValue = parseFloat(value);
      if (numValue < field.optimalMin) {
        issues.push(`${field.label} (${numValue}) is below the optimal range of ${field.optimalMin}–${field.optimalMax}.`);
        if (field.label === "Water pH") {
          recommendations.push("Consider adding lime to increase the pH to the optimal range.");
        } else if (field.label === "Dissolved Oxygen (mg/L)") {
          recommendations.push("Increase aeration or add oxygen supplements to improve dissolved oxygen levels.");
        } else if (field.label === "Temperature (°C)") {
          recommendations.push("Use heaters or shade nets to adjust the water temperature to the optimal range.");
        } else if (field.label === "Adjusted FCR") {
          recommendations.push("Review feeding practices to improve feed efficiency and reduce FCR.");
        }
      } else if (numValue > field.optimalMax) {
        issues.push(`${field.label} (${numValue}) is above the optimal range of ${field.optimalMin}–${field.optimalMax}.`);
        if (field.label === "Water pH") {
          recommendations.push("Consider adding an acidifying agent to lower the pH to the optimal range.");
        } else if (field.label === "Dissolved Oxygen (mg/L)") {
          recommendations.push("High dissolved oxygen is generally not harmful, but ensure proper water circulation.");
        } else if (field.label === "Temperature (°C)") {
          recommendations.push("Use cooling systems or increase water exchange to lower the temperature.");
        } else if (field.label === "Adjusted FCR") {
          recommendations.push("High FCR indicates inefficiency; optimize feed quality and feeding schedule.");
        }
      }
    });

    return { issues, recommendations };
  };

  const handlePredict = async () => {
    setError(null);
    setPrediction(null);
    setProbability(null);
    setPredictionTime(null);

    // Input validation
    const fields = [
      { value: waterPH, field: VALID_RANGES.waterPH },
      { value: dissolvedOxygen, field: VALID_RANGES.dissolvedOxygen },
      { value: temperature, field: VALID_RANGES.temperature },
      { value: shrimpWeight, field: VALID_RANGES.shrimpWeight },
      { value: adjustedFCR, field: VALID_RANGES.adjustedFCR },
    ];

    for (const { value, field } of fields) {
      if (!value) {
        setError("Please fill in all fields.");
        return;
      }
      const validationError = validateInput(value, field);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict-survival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Water_pH: parseFloat(waterPH),
          Dissolved_Oxygen_mg_L: parseFloat(dissolvedOxygen),
          Temperature_C: parseFloat(temperature),
          Shrimp_Weight_g: parseFloat(shrimpWeight),
          Adjusted_FCR: parseFloat(adjustedFCR),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setPrediction(result.survival_prediction);
        setProbability(result.probability * 100); // Convert to percentage
        setPredictionTime(new Date().toLocaleString()); // Set timestamp
        setError(null);
      } else {
        setError(result.error || "Failed to predict survival rate");
      }
    } catch (err) {
      setError("Error connecting to backend");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWaterPH("");
    setDissolvedOxygen("");
    setTemperature("");
    setShrimpWeight("");
    setAdjustedFCR("");
    setPrediction(null);
    setProbability(null);
    setPredictionTime(null);
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0D1B2A 0%, #1A2A44 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          p: 3,
          backgroundColor: "#1E3553",
          borderRadius: 3,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: "#E0F7FA", textAlign: "center" }}>
          Shrimp Survival Prediction
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mx: "auto" }}>
          <Tooltip title="Optimal range: 6.5 to 9.0" placement="right">
            <TextField
              label="Water pH"
              type="number"
              value={waterPH}
              onChange={(e) => setWaterPH(e.target.value)}
              InputLabelProps={{ style: { color: "#E0F7FA" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              helperText={`Range: ${VALID_RANGES.waterPH.min} to ${VALID_RANGES.waterPH.max}`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#E0F7FA" },
                  "&:hover fieldset": { borderColor: "#4CAF50" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
                "& .MuiFormHelperText-root": { color: "#B0BEC5" },
              }}
            />
          </Tooltip>
          <Tooltip title="Optimal range: 3.0 to 8.0 mg/L" placement="right">
            <TextField
              label="Dissolved Oxygen (mg/L)"
              type="number"
              value={dissolvedOxygen}
              onChange={(e) => setDissolvedOxygen(e.target.value)}
              InputLabelProps={{ style: { color: "#E0F7FA" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              helperText={`Range: ${VALID_RANGES.dissolvedOxygen.min} to ${VALID_RANGES.dissolvedOxygen.max}`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#E0F7FA" },
                  "&:hover fieldset": { borderColor: "#4CAF50" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
                "& .MuiFormHelperText-root": { color: "#B0BEC5" },
              }}
            />
          </Tooltip>
          <Tooltip title="Optimal range: 20.0 to 35.0 °C" placement="right">
            <TextField
              label="Temperature (°C)"
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              InputLabelProps={{ style: { color: "#E0F7FA" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              helperText={`Range: ${VALID_RANGES.temperature.min} to ${VALID_RANGES.temperature.max}`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#E0F7FA" },
                  "&:hover fieldset": { borderColor: "#4CAF50" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
                "& .MuiFormHelperText-root": { color: "#B0BEC5" },
              }}
            />
          </Tooltip>
          <Tooltip title="Typical range: 0.1 to 50.0 g" placement="right">
            <TextField
              label="Shrimp Weight (g)"
              type="number"
              value={shrimpWeight}
              onChange={(e) => setShrimpWeight(e.target.value)}
              InputLabelProps={{ style: { color: "#E0F7FA" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              helperText={`Range: ${VALID_RANGES.shrimpWeight.min} to ${VALID_RANGES.shrimpWeight.max}`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#E0F7FA" },
                  "&:hover fieldset": { borderColor: "#4CAF50" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
                "& .MuiFormHelperText-root": { color: "#B0BEC5" },
              }}
            />
          </Tooltip>
          <Tooltip title="Typical range: 0.5 to 3.0" placement="right">
            <TextField
              label="Adjusted FCR"
              type="number"
              value={adjustedFCR}
              onChange={(e) => setAdjustedFCR(e.target.value)}
              InputLabelProps={{ style: { color: "#E0F7FA" } }}
              InputProps={{ style: { color: "#E0F7FA" } }}
              helperText={`Range: ${VALID_RANGES.adjustedFCR.min} to ${VALID_RANGES.adjustedFCR.max}`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#E0F7FA" },
                  "&:hover fieldset": { borderColor: "#4CAF50" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
                "& .MuiFormHelperText-root": { color: "#B0BEC5" },
              }}
            />
          </Tooltip>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={handlePredict}
              disabled={loading}
              sx={{ backgroundColor: "#0288D1", "&:hover": { backgroundColor: "#4CAF50" } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Predict Survival Rate"}
            </Button>
            <Tooltip title="Reset all fields">
              <IconButton onClick={handleReset} sx={{ color: "#E0F7FA" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {prediction !== null && (
            <Box sx={{ mt: 2, textAlign: "left" }}>
              <Typography variant="h6" sx={{ color: "#E0F7FA" }}>
                Survival Prediction: {prediction}
              </Typography>
              <Typography variant="body1" sx={{ color: "#E0F7FA" }}>
                Probability of High Survival: {probability.toFixed(2)}%
              </Typography>
              <Typography variant="body2" sx={{ color: "#B0BEC5", mt: 1 }}>
                Confidence Level: The model is {probability.toFixed(2)}% confident in this prediction. 
                {probability >= 80 ? " This indicates high certainty." : probability >= 60 ? " This indicates moderate certainty." : " This indicates low certainty; consider reviewing the inputs."}
              </Typography>
              <Typography variant="body2" sx={{ color: "#B0BEC5", mt: 1 }}>
                Prediction made on: {predictionTime}
              </Typography>
              <Typography variant="body2" sx={{ color: "#E0F7FA", mt: 1 }}>
                Input Values Used:
              </Typography>
              <Typography variant="body2" sx={{ color: "#B0BEC5", ml: 2 }}>
                - Water pH: {waterPH}
              </Typography>
              <Typography variant="body2" sx={{ color: "#B0BEC5", ml: 2 }}>
                - Dissolved Oxygen: {dissolvedOxygen} mg/L
              </Typography>
              <Typography variant="body2" sx={{ color: "#B0BEC5", ml: 2 }}>
                - Temperature: {temperature}°C
              </Typography>
              <Typography variant="body2" sx={{ color: "#B0BEC5", ml: 2 }}>
                - Shrimp Weight: {shrimpWeight} g
              </Typography>
              <Typography variant="body2" sx={{ color: "#B0BEC5", ml: 2 }}>
                - Adjusted FCR: {adjustedFCR}
              </Typography>
              {(() => {
                const { issues, recommendations } = getSuboptimalInputs();
                return issues.length > 0 ? (
                  <>
                    <Typography variant="body2" sx={{ color: "#FF6B6B", mt: 1 }}>
                      Potential Issues:
                    </Typography>
                    {issues.map((issue, index) => (
                      <Typography key={index} variant="body2" sx={{ color: "#FF6B6B", ml: 2 }}>
                        - {issue}
                      </Typography>
                    ))}
                    <Typography variant="body2" sx={{ color: "#4CAF50", mt: 1 }}>
                      Recommendations:
                    </Typography>
                    {recommendations.map((rec, index) => (
                      <Typography key={index} variant="body2" sx={{ color: "#4CAF50", ml: 2 }}>
                        - {rec}
                      </Typography>
                    ))}
                  </>
                ) : (
                  <Typography variant="body2" sx={{ color: "#4CAF50", mt: 1 }}>
                    All input values are within optimal ranges.
                  </Typography>
                );
              })()}
            </Box>
          )}
          <Button
            variant="outlined"
            onClick={() => navigate("/menu")}
            sx={{
              mt: 2,
              color: "#E0F7FA",
              borderColor: "#4CAF50",
              "&:hover": { borderColor: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.1)" },
            }}
          >
            Back to Menu
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ShrimpSurvivalPage;