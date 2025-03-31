import React, { useEffect, useState, Component } from "react";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import WaterQualityChart from "./components/WaterQualityChart";
import WaterQualityTable from "./components/WaterQualityTable";
import ShrimpGrowthChart from "./components/ShrimpGrowthChart";
import ShrimpGrowthTable from "./components/ShrimpGrowthTable";
import FeedFCRChart from "./components/FeedFCRChart";
import FeedFCRTable from "./components/FeedFCRTable";
import FeedMealsChart from "./components/FeedMealsChart";
import FeedMealsTable from "./components/FeedMealsTable";
import AddWaterQualityForm from "./components/AddWaterQualityForm";
import FeedPredictionPage from "./components/FeedPredictionPage";
import ShrimpSurvivalPage from "./components/ShrimpSurvivalPage";
import OverallVisualizationPage from "./components/OverallVisualizationPage";
import PondHealthPage from "./components/PondHealthPage";
import WelcomePage from "./components/WelcomePage";
import MenuPage from "./components/MenuPage";
import ChatbotSidebar from "./components/ChatbotSidebar";

// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#0288D1", // Calming blue
    },
    secondary: {
      main: "#4CAF50", // Softer green
    },
    background: {
      default: "#1A2A44", // Deep blue background
    },
    text: {
      primary: "#E0F7FA", // Light cyan for readability
      secondary: "#B0BEC5",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h3: {
      fontWeight: 700,
      color: "#E0F7FA",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "transform 0.2s, background-color 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            backgroundColor: "#4CAF50",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#2A4066",
          borderRadius: 8,
          color: "#E0F7FA",
          ".MuiSelect-icon": { color: "#E0F7FA" },
        },
      },
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ mt: 4, p: 2, textAlign: "center", color: "#FF6B6B" }}>
          <Typography variant="h4">Something went wrong.</Typography>
          <Typography>{this.state.error.message}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#0288D1", color: "#FFFFFF" }}
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

function App() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("welcome");
  const [recordsFilter, setRecordsFilter] = useState(200);
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [pondAreaRange, setPondAreaRange] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const API_ENDPOINTS = {
    "water-quality": "http://127.0.0.1:5000/api/water-quality",
    "shrimp-growth": "http://127.0.0.1:5000/api/shrimp-growth",
    "feed-fcr": "http://127.0.0.1:5000/api/feed-fcr",
    "feed-meals": "http://127.0.0.1:5000/api/feed-meals",
    "pond-health": "http://127.0.0.1:5000/api/water-quality",
  };

  const SHRIMP_SPECIES = ["P. monodon", "M. rosenbergii", "L. vannamei"];

  const POND_AREA_RANGES = [
    { label: "All Areas", value: "all" },
    { label: "Minor: < 250 m²", value: "Minor" },
    { label: "Small: 250-500 m²", value: "Small" },
    { label: "Medium: 500-1000 m²", value: "Medium" },
    { label: "Large: > 1000 m²", value: "Large" },
  ];

  // Update selectedTab based on the current route
  useEffect(() => {
    const path = location.pathname.replace("/", "") || "welcome";
    if (
      [
        "welcome",
        "menu",
        "water-quality",
        "shrimp-growth",
        "feed-fcr",
        "feed-meals",
        "add-data",
        "feed-prediction",
        "shrimp-survival",
        "overall-visualizations",
        "pond-health",
      ].includes(path)
    ) {
      setSelectedTab(path);
    }
  }, [location.pathname]);

  // Fetch data when the tab or filters change (for visualization tabs only)
  useEffect(() => {
    if (["water-quality", "shrimp-growth", "feed-fcr", "feed-meals", "pond-health"].includes(selectedTab)) {
      setData([]);
      const fetchData = async () => {
        try {
          let url = `${API_ENDPOINTS[selectedTab]}?limit=${recordsFilter}`;
          if (selectedSpecies) url += `&species=${encodeURIComponent(selectedSpecies)}`;
          if (pondAreaRange && pondAreaRange !== "all") url += `&pond_area_range=${pondAreaRange}`;
          const response = await fetch(url);
          const result = await response.json();
          if (response.ok) {
            setData(result);
            setError("");
          } else {
            setError(result.error || "Failed to fetch data");
          }
        } catch (err) {
          setError("Error connecting to backend");
          console.error(err);
        }
      };
      fetchData();
    }
  }, [selectedTab, recordsFilter, selectedSpecies, pondAreaRange]);

  // Render content based on the selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "welcome":
        return <WelcomePage />;
      case "menu":
        return <MenuPage />;
      case "water-quality":
        return (
          <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
            <WaterQualityChart data={data} selectedSpecies={selectedSpecies} />
            <WaterQualityTable data={data} selectedSpecies={selectedSpecies} />
          </Box>
        );
      case "shrimp-growth":
        return (
          <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
            <ShrimpGrowthChart data={data} selectedSpecies={selectedSpecies} />
            <ShrimpGrowthTable data={data} selectedSpecies={selectedSpecies} />
          </Box>
        );
      case "feed-fcr":
        return (
          <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
            <FeedFCRChart data={data} selectedSpecies={selectedSpecies} />
            <FeedFCRTable data={data} selectedSpecies={selectedSpecies} />
          </Box>
        );
      case "feed-meals":
        return (
          <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
            <FeedMealsChart data={data} selectedSpecies={selectedSpecies} />
            <FeedMealsTable data={data} selectedSpecies={selectedSpecies} />
          </Box>
        );
      case "add-data":
        return (
          <Box sx={{ p: 3, backgroundColor: "#1E3553", borderRadius: 3, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}>
            <AddWaterQualityForm />
          </Box>
        );
      case "feed-prediction":
        return <FeedPredictionPage />;
      case "shrimp-survival":
        return <ShrimpSurvivalPage />;
      case "overall-visualizations":
        return <OverallVisualizationPage />;
      case "pond-health":
        return (
          <PondHealthPage
            data={data}
            recordsFilter={recordsFilter}
            selectedSpecies={selectedSpecies}
            pondAreaRange={pondAreaRange}
          />
        );
      default:
        return <Typography variant="h5">Page Not Found</Typography>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <Box
          sx={{
            minHeight: "100vh",
            padding: "20px",
            background: "linear-gradient(135deg, #0D1B2A 0%, #1A2A44 100%)",
            position: "relative",
          }}
        >
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Shrimp FCR Dashboard
              </Typography>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/menu">Menu</Button>
              <Button color="inherit" component={Link} to="/feed-prediction">Feed Prediction</Button>
              <Button color="inherit" component={Link} to="/shrimp-survival">Survival Prediction</Button>
              <Button color="inherit" component={Link} to="/water-quality">Water Quality</Button>
              <Button color="inherit" component={Link} to="/shrimp-growth">Shrimp Growth</Button>
              <Button color="inherit" component={Link} to="/feed-fcr">Feed & FCR</Button>
              <Button color="inherit" component={Link} to="/feed-meals">Feed Meals</Button>
              <Button color="inherit" component={Link} to="/overall-visualizations">Overall Visualizations</Button>
              <Button color="inherit" component={Link} to="/pond-health">Pond Health</Button>
              <Button color="inherit" component={Link} to="/add-data">Add Data</Button>
            </Toolbar>
          </AppBar>
          <Container
            maxWidth="lg"
            sx={{
              backgroundColor: "#152238",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              padding: "20px",
              color: "#E0F7FA",
              mt: 4,
            }}
          >
            <Typography variant="h3" align="center" sx={{ mb: 4 }}>
              Shrimp FCR Prediction Dashboard
            </Typography>

            {["water-quality", "shrimp-growth", "feed-fcr", "feed-meals", "add-data"].includes(selectedTab) && (
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {selectedTab.replace("-", " ").toUpperCase()}
                </Typography>
              </Box>
            )}

            {/* Filters for visualization tabs */}
            {["water-quality", "shrimp-growth", "feed-fcr", "feed-meals", "pond-health"].includes(selectedTab) && (
              <Box sx={{ mb: 4, display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Latest Records</InputLabel>
                  <Select
                    value={recordsFilter}
                    onChange={(e) => setRecordsFilter(e.target.value)}
                  >
                    {[10, 20, 50, 100, 200].map((value) => (
                      <MenuItem key={value} value={value} sx={{ color: "#212121" }}>
                        Last {value} Records
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Shrimp Species</InputLabel>
                  <Select
                    value={selectedSpecies}
                    onChange={(e) => setSelectedSpecies(e.target.value)}
                  >
                    <MenuItem value="" sx={{ color: "#212121" }}>
                      All Species
                    </MenuItem>
                    {SHRIMP_SPECIES.map((species) => (
                      <MenuItem key={species} value={species} sx={{ color: "#212121" }}>
                        {species}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Pond Area Range</InputLabel>
                  <Select
                    value={pondAreaRange}
                    onChange={(e) => setPondAreaRange(e.target.value)}
                  >
                    {POND_AREA_RANGES.map((range) => (
                      <MenuItem key={range.value} value={range.value} sx={{ color: "#212121" }}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {error && (
              <Typography color="error" sx={{ textAlign: "center", mb: 3, color: "#FF6B6B" }}>
                {error}
              </Typography>
            )}

            <Box sx={{ mt: 5 }}>{renderContent()}</Box>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                variant="outlined"
                color="secondary"
                component={Link}
                to="/menu"
                sx={{
                  fontSize: "0.9rem",
                  padding: "8px 16px",
                  borderRadius: 8,
                  color: "#E0F7FA",
                  borderColor: "#4CAF50",
                }}
              >
                BACK TO MENU
              </Button>
            </Box>
          </Container>

          {/* Floating Chatbot Button */}
          <IconButton
            onClick={() => setChatbotOpen(true)}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              backgroundColor: "#0288D1",
              color: "#E0F7FA",
              "&:hover": { backgroundColor: "#4CAF50" },
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              zIndex: 1300, // Ensure it appears above other elements
            }}
          >
            <ChatIcon />
          </IconButton>

          {/* Chatbot Sidebar */}
          <ChatbotSidebar
            open={chatbotOpen}
            onClose={() => setChatbotOpen(false)}
            currentPage={selectedTab} // Pass the current page to the chatbot
          />
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;