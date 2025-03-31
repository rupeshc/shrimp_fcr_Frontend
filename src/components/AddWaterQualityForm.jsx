import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";

const AddWaterQualityForm = () => {
  const [formData, setFormData] = useState({
    Water_pH: "",
    Temperature_C: "",
    Salinity_ppt: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/add-water-quality", formData);
      setMessage(response.data.message);
      setFormData({ Water_pH: "", Temperature_C: "", Salinity_ppt: "" }); // Reset form
    } catch (error) {
      setMessage("Error adding data: " + error.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 4,
        p: 3,
        backgroundColor: "#424242",
        borderRadius: 2,
        border: "2px solid #FFFFFF",
        color: "#FFFFFF",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "#FFD700" }}>
        Add Water Quality Data
      </Typography>
      <TextField
        label="Water pH"
        name="Water_pH"
        value={formData.Water_pH}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2, input: { color: "#FFFFFF" }, label: { color: "#FFFFFF" } }}
      />
      <TextField
        label="Temperature (°C)"
        name="Temperature_C"
        value={formData.Temperature_C}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2, input: { color: "#FFFFFF" }, label: { color: "#FFFFFF" } }}
      />
      <TextField
        label="Salinity (ppt)"
        name="Salinity_ppt"
        value={formData.Salinity_ppt}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2, input: { color: "#FFFFFF" }, label: { color: "#FFFFFF" } }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ backgroundColor: "#FFD700", color: "#000000", "&:hover": { backgroundColor: "#FFC107" } }}
      >
        Submit
      </Button>
      {message && <Alert severity={message.includes("Error") ? "error" : "success"} sx={{ mt: 2 }}>{message}</Alert>}
    </Box>
  );
};

export default AddWaterQualityForm;