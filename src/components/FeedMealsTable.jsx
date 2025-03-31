import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from "@mui/material";

function FeedMealsTable({ data, selectedSpecies }) {
  const filteredData = selectedSpecies ? data.filter((d) => d.Shrimp_Species === selectedSpecies) : data;

  return (
    <Box>
      <Typography variant="h6" sx={{ color: "#E0F7FA", mb: 2 }}>Feed Meals Data</Typography>
      <Table sx={{ color: "#E0F7FA" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#E0F7FA", borderBottom: "2px solid #4CAF50" }}>Feed Type</TableCell>
            <TableCell sx={{ color: "#E0F7FA", borderBottom: "2px solid #4CAF50" }}>Meal Frequency</TableCell>
            <TableCell sx={{ color: "#E0F7FA", borderBottom: "2px solid #4CAF50" }}>Cost (USD/kg)</TableCell>
            <TableCell sx={{ color: "#E0F7FA", borderBottom: "2px solid #4CAF50" }}>Species</TableCell>
            <TableCell sx={{ color: "#E0F7FA", borderBottom: "2px solid #4CAF50" }}>Pond Area (m²)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((record, index) => (
            <TableRow key={index}>
              <TableCell sx={{ color: "#E0F7FA", borderBottom: "1px solid #4CAF50" }}>{record.Feed_Type || "N/A"}</TableCell>
              <TableCell sx={{ color: "#E0F7FA", borderBottom: "1px solid #4CAF50" }}>{record.Meal_Frequency || "N/A"}</TableCell>
              <TableCell sx={{ color: "#E0F7FA", borderBottom: "1px solid #4CAF50" }}>{record.Feed_Cost_per_Kg_USD ? record.Feed_Cost_per_Kg_USD.toFixed(2) : "N/A"}</TableCell>
              <TableCell sx={{ color: "#E0F7FA", borderBottom: "1px solid #4CAF50" }}>{record.Shrimp_Species || "N/A"}</TableCell>
              <TableCell sx={{ color: "#E0F7FA", borderBottom: "1px solid #4CAF50" }}>{record.Pond_Area_m2 || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default FeedMealsTable;