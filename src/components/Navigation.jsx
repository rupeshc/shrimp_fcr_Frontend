import React from "react";
import { Box, Button } from "@mui/material";

const Navigation = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    "water-quality",
    "shrimp-growth",
    "feed-fcr",
    "feed-meals", // Already present in your app
    "shrimp-health-yield", // New tab
    "add-data",
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={selectedTab === tab ? "contained" : "outlined"}
          onClick={() => setSelectedTab(tab)}
          sx={{
            fontWeight: "bold",
            color: selectedTab === tab ? "#000000" : "#FFFFFF",
            borderColor: "#FFFFFF",
          }}
        >
          {tab.replace("-", " ").toUpperCase()}
        </Button>
      ))}
    </Box>
  );
};

export default Navigation;