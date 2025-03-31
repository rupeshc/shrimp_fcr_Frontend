import React from "react";
import { Box, Typography } from "@mui/material";

const Dashboard = ({ children }) => {
  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4, color: "#FFD700" }}>
        Dashboard Overview
      </Typography>
      {children}
    </Box>
  );
};

export default Dashboard;