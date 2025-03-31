import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import WaterQualityChart from "./WaterQualityChart";
import WaterQualityTable from "./WaterQualityTable";
import { useSearchParams } from "react-router-dom";

const WaterQualityPage = () => {
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const species = searchParams.get("species") || "";
  const pondAreaRange = searchParams.get("pond_area_range") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `http://127.0.0.1:5000/api/water-quality?limit=200`;
        if (species) url += `&species=${encodeURIComponent(species)}`;
        if (pondAreaRange) url += `&pond_area_range=${pondAreaRange}`;
        const response = await fetch(url);
        const result = await response.json();
        if (response.ok) setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [species, pondAreaRange]);

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: "#424242", color: "#FFFFFF" }}>
      <Typography variant="h4" sx={{ mb: 2, color: "#FFD700", textAlign: "center" }}>
        Water Quality Visualization
      </Typography>
      <WaterQualityChart data={data} selectedSpecies={species} />
      <WaterQualityTable data={data} selectedSpecies={species} />
    </Box>
  );
};

export default WaterQualityPage;