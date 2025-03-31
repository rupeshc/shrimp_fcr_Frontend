import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import WaterQualityChart from "./WaterQualityChart";
import WaterQualityTable from "./WaterQualityTable";
import ShrimpGrowthChart from "./ShrimpGrowthChart";
import ShrimpGrowthTable from "./ShrimpGrowthTable";
import FeedFCRChart from "./FeedFCRChart";
import FeedFCRTable from "./FeedFCRTable";
import FeedMealsChart from "./FeedMealsChart";
import FeedMealsTable from "./FeedMealsTable";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Title);

const OverallVisualizationPage = () => {
  const [data, setData] = useState({ water: [], growth: [], fcr: [], meals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState("overall");
  const [recordsFilter, setRecordsFilter] = useState(200);
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [pondAreaRange, setPondAreaRange] = useState("all");
  const navigate = useNavigate();

  const SHRIMP_SPECIES = ["P. monodon", "M. rosenbergii", "L. vannamei"];
  const POND_AREA_RANGES = [
    { label: "All Areas", value: "all" },
    { label: "Below 500 m²", value: "below_500" },
    { label: "500–1,000 m²", value: "range_500_to_1000" },
    { label: "Above 1,000 m²", value: "above_1000" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoints = [
          `http://127.0.0.1:5000/api/water-quality?limit=${recordsFilter}${selectedSpecies ? `&species=${encodeURIComponent(selectedSpecies)}` : ""}${pondAreaRange !== "all" ? `&pond_area_range=${pondAreaRange}` : ""}`,
          `http://127.0.0.1:5000/api/shrimp-growth?limit=${recordsFilter}${selectedSpecies ? `&species=${encodeURIComponent(selectedSpecies)}` : ""}${pondAreaRange !== "all" ? `&pond_area_range=${pondAreaRange}` : ""}`,
          `http://127.0.0.1:5000/api/feed-fcr?limit=${recordsFilter}${selectedSpecies ? `&species=${encodeURIComponent(selectedSpecies)}` : ""}${pondAreaRange !== "all" ? `&pond_area_range=${pondAreaRange}` : ""}`,
          `http://127.0.0.1:5000/api/feed-meals?limit=${recordsFilter}${selectedSpecies ? `&species=${encodeURIComponent(selectedSpecies)}` : ""}${pondAreaRange !== "all" ? `&pond_area_range=${pondAreaRange}` : ""}`,
        ];
        const [waterResponse, growthResponse, fcrResponse, mealsResponse] = await Promise.all(
          endpoints.map((url) => fetch(url))
        );
        if (!waterResponse.ok || !growthResponse.ok || !fcrResponse.ok || !mealsResponse.ok) {
          throw new Error("Failed to fetch data from backend");
        }
        const [waterData, growthData, fcrData, mealsData] = await Promise.all([
          waterResponse.json(),
          growthResponse.json(),
          fcrResponse.json(),
          mealsResponse.json(),
        ]);
        setData({ water: waterData, growth: growthData, fcr: fcrData, meals: mealsData });
        setLoading(false);
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
        setLoading(false);
      }
    };
    fetchData();
  }, [recordsFilter, selectedSpecies, pondAreaRange]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  // Bar Chart: Average Values (Updated with dynamic labels)
  const metrics = [
    { label: "Water pH", data: data.water, key: "Water_pH" },
    { label: "Shrimp Size (g)", data: data.growth, key: "Shrimp_Size_g" },
    { label: "Adjusted FCR", data: data.fcr, key: "Adjusted_FCR" },
    { label: "Feed Cost (USD/kg)", data: data.meals, key: "Feed_Cost_per_Kg_USD" },
  ];

  const averages = metrics.map((metric) =>
    metric.data.length ? metric.data.reduce((sum, d) => sum + (d[metric.key] || 0), 0) / metric.data.length : 0
  );
  const validMetrics = metrics.filter((_, index) => averages[index] > 0);

  const barChartData = {
    labels: validMetrics.map((metric) => metric.label),
    datasets: [
      {
        label: "Average Values",
        data: averages.filter((value) => value > 0),
        backgroundColor: ["#0288D1", "#4CAF50", "#FF6B6B", "#FFCA28"],
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
        text: "Overall Shrimp Farming Metrics",
        font: { size: 18 },
        color: "#E0F7FA",
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Average Value", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
      x: { title: { display: true, text: "Metrics", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
    },
  };

  // Line Chart: Feed Consumption Trend
  const feedConsumptionData = data.fcr.map((item, index) => ({
    x: index + 1,
    y: item.Total_Feed_Consumed_per_Day_g || 0,
  }));
  const lineChartData = {
    labels: feedConsumptionData.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: "Feed Consumption (g/day)",
        data: feedConsumptionData.map((d) => d.y),
        fill: false,
        borderColor: "#FFCA28",
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#E0F7FA" } },
      title: {
        display: true,
        text: "Feed Consumption Trend",
        font: { size: 18 },
        color: "#E0F7FA",
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Feed (g/day)", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
      x: { title: { display: true, text: "Day", color: "#E0F7FA" }, ticks: { color: "#E0F7FA" } },
    },
  };

  // Top 5 Feed FCR Records
  const topFeedRecords = data.fcr
    .sort((a, b) => b.Adjusted_FCR - a.Adjusted_FCR)
    .slice(0, 5)
    .map((record, index) => ({
      id: index + 1,
      feed: record.Total_Feed_Consumed_per_Day_g || "N/A",
      yield: record.Harvest_Yield_Prediction_kg_ha || "N/A",
      fcr: record.Adjusted_FCR || "N/A",
    }));

  return (
    <Box sx={{ mt: 4, p: 2, backgroundColor: "#1A2A44", color: "#E0F7FA" }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Overall Visualizations
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: "#E0F7FA" }}>Latest Records</InputLabel>
          <Select
            value={recordsFilter}
            onChange={(e) => setRecordsFilter(e.target.value)}
            sx={{ color: "#E0F7FA", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0288D1" } }}
          >
            {[10, 20, 50, 100, 200].map((value) => (
              <MenuItem key={value} value={value} sx={{ color: "#212121" }}>
                Last {value} Records
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: "#E0F7FA" }}>Shrimp Species</InputLabel>
          <Select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            sx={{ color: "#E0F7FA", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0288D1" } }}
          >
            <MenuItem value="" sx={{ color: "#212121" }}>All Species</MenuItem>
            {SHRIMP_SPECIES.map((species) => (
              <MenuItem key={species} value={species} sx={{ color: "#212121" }}>
                {species}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: "#E0F7FA" }}>Pond Area Range</InputLabel>
          <Select
            value={pondAreaRange}
            onChange={(e) => setPondAreaRange(e.target.value)}
            sx={{ color: "#E0F7FA", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0288D1" } }}
          >
            {POND_AREA_RANGES.map((range) => (
              <MenuItem key={range.value} value={range.value} sx={{ color: "#212121" }}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          sx={{ "& .MuiTabs-indicator": { backgroundColor: "#0288D1" } }}
        >
          <Tab
            label="Overall Visuals"
            value="overall"
            sx={{ color: "#E0F7FA", "&.Mui-selected": { color: "#0288D1" }, fontWeight: 500 }}
          />
          <Tab
            label="Water Quality"
            value="water-quality"
            sx={{ color: "#E0F7FA", "&.Mui-selected": { color: "#0288D1" }, fontWeight: 500 }}
          />
          <Tab
            label="Shrimp Growth"
            value="shrimp-growth"
            sx={{ color: "#E0F7FA", "&.Mui-selected": { color: "#0288D1" }, fontWeight: 500 }}
          />
          <Tab
            label="Feed FCR"
            value="feed-fcr"
            sx={{ color: "#E0F7FA", "&.Mui-selected": { color: "#0288D1" }, fontWeight: 500 }}
          />
          <Tab
            label="Feed Meals"
            value="feed-meals"
            sx={{ color: "#E0F7FA", "&.Mui-selected": { color: "#0288D1" }, fontWeight: 500 }}
          />
        </Tabs>
      </Box>

      <Button
        variant="outlined"
        onClick={() => navigate("/menu")}
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "#E0F7FA",
          borderColor: "#4CAF50",
          "&:hover": { borderColor: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.1)" },
          transition: "border-color 0.25s",
        }}
      >
        Back to Menu
      </Button>

      {tabValue === "overall" && (
        <>
          <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", mb: 4 }}>
            <Bar data={barChartData} options={barOptions} />
          </Box>
          <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", mb: 4 }}>
            <Line data={lineChartData} options={lineOptions} />
          </Box>
          <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#E0F7FA" }}>
              Top 5 Feed FCR Records
            </Typography>
            <Table sx={{ color: "#E0F7FA" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#E0F7FA", borderBottom: "2px solid #4CAF50" }}>ID</TableCell>
                  <TableCell sx={{ color: "#E0F7FA", borderBottom: "2px solid #4CAF50" }}>Feed (g/day)</TableCell>
                  <TableCell sx={{ color: "#E0F7FA", borderBottom: "2px solid #4CAF50" }}>Yield (kg/ha)</TableCell>
                  <TableCell sx={{ color: "#E0F7FA", borderBottom: "2px solid #4CAF50" }}>FCR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topFeedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell sx={{ color: "#E0F7FA", borderBottom: "1px solid #4CAF50" }}>{record.id}</TableCell>
                    <TableCell sx={{ color: "#E0F7FA", borderBottom: "1px solid #4CAF50" }}>{record.feed}</TableCell>
                    <TableCell sx={{ color: "#E0F7FA", borderBottom: "1px solid #4CAF50" }}>{record.yield}</TableCell>
                    <TableCell sx={{ color: "#E0F7FA", borderBottom: "1px solid #4CAF50" }}>{Number(record.fcr).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </>
      )}

      {tabValue === "water-quality" && (
        <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
          <WaterQualityChart data={data.water} selectedSpecies={selectedSpecies} />
          <WaterQualityTable data={data.water} selectedSpecies={selectedSpecies} />
        </Box>
      )}

      {tabValue === "shrimp-growth" && (
        <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
          <ShrimpGrowthChart data={data.growth} selectedSpecies={selectedSpecies} />
          <ShrimpGrowthTable data={data.growth} selectedSpecies={selectedSpecies} />
        </Box>
      )}

      {tabValue === "feed-fcr" && (
        <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
          <FeedFCRChart data={data.fcr} selectedSpecies={selectedSpecies} />
          <FeedFCRTable data={data.fcr} selectedSpecies={selectedSpecies} />
        </Box>
      )}

      {tabValue === "feed-meals" && (
        <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
          <FeedMealsChart data={data.meals} selectedSpecies={selectedSpecies} />
          <FeedMealsTable data={data.meals} selectedSpecies={selectedSpecies} />
        </Box>
      )}
    </Box>
  );
};

export default OverallVisualizationPage;