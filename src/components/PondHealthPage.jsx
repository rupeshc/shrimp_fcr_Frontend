import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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
import { useNavigate, useSearchParams } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const PondHealthPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speciesList, setSpeciesList] = useState([]); // List of unique species
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = searchParams.get("limit") || "200"; // Number of records filter
  const species = searchParams.get("species") || ""; // Species filter
  const pondAreaRange = searchParams.get("pond_area_range") || ""; // Pond area range filter
  const navigate = useNavigate();

  // Hardcoded pond area range options (since not available in API response)
  const pondAreaRanges = ["Small", "Medium", "Large"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Construct the API URL with filter parameters
        let url = `http://127.0.0.1:5000/api/water-quality?limit=${limit}`;
        if (species) url += `&species=${encodeURIComponent(species)}`;
        if (pondAreaRange) url += `&pond_area_range=${pondAreaRange}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const waterData = await response.json();
        setData(waterData);

        // Extract unique species for the dropdown
        const uniqueSpecies = [...new Set(waterData.map((item) => item.Shrimp_Species))];
        setSpeciesList(uniqueSpecies);

        setLoading(false);
      } catch (err) {
        setError(`Error fetching water quality data: ${err.message}`);
        setLoading(false);
      }
    };
    fetchData();
  }, [limit, species, pondAreaRange]); // Re-fetch data when any filter changes

  // Handle filter changes by updating URL query parameters
  const handleLimitChange = (event) => {
    setSearchParams({ ...Object.fromEntries(searchParams), limit: event.target.value });
  };

  const handleSpeciesChange = (event) => {
    const newSpecies = event.target.value;
    if (newSpecies === "") {
      const params = Object.fromEntries(searchParams);
      delete params.species;
      setSearchParams(params);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), species: newSpecies });
    }
  };

  const handlePondAreaRangeChange = (event) => {
    const newPondAreaRange = event.target.value;
    if (newPondAreaRange === "") {
      const params = Object.fromEntries(searchParams);
      delete params.pond_area_range;
      setSearchParams(params);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), pond_area_range: newPondAreaRange });
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: "center", color: "#E0F7FA" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center", color: "#E0F7FA" }}>
        <Alert severity="error" sx={{ mb: 2, color: "#FF6B6B" }}>{error}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/menu")}
          sx={{ backgroundColor: "#0288D1", "&:hover": { backgroundColor: "#4CAF50" } }}
        >
          Back to Menu
        </Button>
      </Box>
    );
  }

  // Apply client-side filtering for species (to match WaterQualityChart approach)
  const filteredData = data.filter((d) => {
    const speciesMatch = !species || d.Shrimp_Species === species;
    // Note: pond_area_range filtering is handled by the API, so no client-side filtering needed for it
    return speciesMatch;
  });

  const avgWaterPH = filteredData.length
    ? (filteredData.reduce((sum, d) => sum + d.Water_pH, 0) / filteredData.length).toFixed(2)
    : 0;
  const avgDO = filteredData.length
    ? (filteredData.reduce((sum, d) => sum + d.Dissolved_Oxygen_mg_L, 0) / filteredData.length).toFixed(2)
    : 0;
  const avgTemp = filteredData.length
    ? (filteredData.reduce((sum, d) => sum + d.Temperature_C, 0) / filteredData.length).toFixed(2)
    : 0;

  const barChartData = {
    labels: ["Water pH", "Dissolved Oxygen (mg/L)", "Temperature (°C)"],
    datasets: [
      {
        label: "Average Values",
        data: [avgWaterPH, avgDO, avgTemp],
        backgroundColor: ["#0288D1", "#4CAF50", "#FFCA28"],
        borderColor: "#E0F7FA",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#E0F7FA" } },
      title: {
        display: true,
        text: `Pond Health Metrics${species ? ` (${species})` : ""}${
          pondAreaRange ? ` (${pondAreaRange})` : ""
        }`,
        font: { size: 18 },
        color: "#E0F7FA",
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Value", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
      x: { title: { display: true, text: "Metrics", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
    },
  };

  const healthStatus =
    avgWaterPH >= 7 && avgWaterPH <= 8.5 && avgDO >= 5 && avgTemp >= 25 && avgTemp <= 30
      ? "Good"
      : "Needs Attention";

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: "#1A2A44", color: "#E0F7FA" }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Pond Health Analysis
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/menu")}
          sx={{
            fontWeight: "bold",
            color: "#E0F7FA",
            borderColor: "#4CAF50",
            "&:hover": { borderColor: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.1)" },
          }}
        >
          Back to Menu
        </Button>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "#E0F7FA" }}>Records</InputLabel>
            <Select
              value={limit}
              onChange={handleLimitChange}
              label="Records"
              sx={{
                color: "#E0F7FA",
                borderColor: "#E0F7FA",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E0F7FA" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4CAF50" },
              }}
            >
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="50">50</MenuItem>
              <MenuItem value="100">100</MenuItem>
              <MenuItem value="200">200</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "#E0F7FA" }}>Species</InputLabel>
            <Select
              value={species}
              onChange={handleSpeciesChange}
              label="Species"
              sx={{
                color: "#E0F7FA",
                borderColor: "#E0F7FA",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E0F7FA" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4CAF50" },
              }}
            >
              <MenuItem value="">All Species</MenuItem>
              {speciesList.map((sp) => (
                <MenuItem key={sp} value={sp}>
                  {sp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "#E0F7FA" }}>Pond Area Range</InputLabel>
            <Select
              value={pondAreaRange}
              onChange={handlePondAreaRangeChange}
              label="Pond Area Range"
              sx={{
                color: "#E0F7FA",
                borderColor: "#E0F7FA",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E0F7FA" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4CAF50" },
              }}
            >
              <MenuItem value="">All Sizes</MenuItem>
              {pondAreaRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pond Health Status: <span style={{ color: healthStatus === "Good" ? "#4CAF50" : "#FF6B6B" }}>{healthStatus}</span>
        </Typography>
        <Bar data={barChartData} options={barOptions} />
      </Box>
    </Box>
  );
};

export default PondHealthPage;