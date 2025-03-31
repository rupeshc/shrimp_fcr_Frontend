import React, { useEffect, useState } from "react";
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FeedMealsChart from "./FeedMealsChart";
import FeedMealsTable from "./FeedMealsTable";

const FeedMealsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(200);
  const [species, setSpecies] = useState("");
  const [pondAreaRange, setPondAreaRange] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `?limit=${limit}${species ? `&species=${species}` : ""}${pondAreaRange !== "all" ? `&pond_area_range=${pondAreaRange}` : ""}`;
        const response = await fetch(`http://127.0.0.1:5000/api/feed-meals${query}`);
        if (!response.ok) throw new Error("Failed to fetch feed meals data");
        const feedMealsData = await response.json();
        setData(feedMealsData);
        setLoading(false);
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
        setLoading(false);
      }
    };
    fetchData();
  }, [limit, species, pondAreaRange]);

  const handleLimitChange = (event) => setLimit(event.target.value) || setLoading(true);
  const handleSpeciesChange = (event) => setSpecies(event.target.value) || setLoading(true);
  const handlePondAreaRangeChange = (event) => setPondAreaRange(event.target.value) || setLoading(true);

  if (loading) return <Box sx={{ mt: 4, textAlign: "center", color: "#E0F7FA" }}><Typography>Loading...</Typography></Box>;
  if (error) return (
    <Box sx={{ mt: 4, textAlign: "center", color: "#E0F7FA" }}>
      <Typography color="error">{error}</Typography>
      <Button variant="contained" onClick={() => navigate("/menu")} sx={{ mt: 2, backgroundColor: "#0288D1", "&:hover": { backgroundColor: "#4CAF50" } }}>
        Back to Menu
      </Button>
    </Box>
  );

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: "#1A2A44", color: "#E0F7FA", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>Feed Meals Analysis</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: "#E0F7FA" }}>No of Records</InputLabel>
          <Select value={limit} onChange={handleLimitChange} label="No of Records" sx={{ color: "#E0F7FA", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0288D1" } }}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: "#E0F7FA" }}>Species</InputLabel>
          <Select value={species} onChange={handleSpeciesChange} label="Species" sx={{ color: "#E0F7FA", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0288D1" } }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="P. monodon">P. monodon</MenuItem>
            <MenuItem value="M. rosenbergii">M. rosenbergii</MenuItem>
            <MenuItem value="L. vannamei">L. vannamei</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: "#E0F7FA" }}>Pond Size</InputLabel>
          <Select value={pondAreaRange} onChange={handlePondAreaRangeChange} label="Pond Size" sx={{ color: "#E0F7FA", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0288D1" } }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="below_500">Below 500 m²</MenuItem>
            <MenuItem value="range_500_to_1000">500-1000 m²</MenuItem>
            <MenuItem value="above_1000">Above 1000 m²</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button variant="outlined" onClick={() => navigate("/menu")} sx={{ mb: 2, fontWeight: "bold", color: "#E0F7FA", borderColor: "#4CAF50", "&:hover": { borderColor: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.1)" } }}>
        Back to Menu
      </Button>
      <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
        <FeedMealsChart data={data} selectedSpecies={species} />
        <FeedMealsTable data={data} selectedSpecies={species} />
      </Box>
    </Box>
  );
};

export default FeedMealsPage;