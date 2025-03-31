import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const ShrimpGrowthTable = ({ data, selectedSpecies }) => {
  const filteredData = selectedSpecies
    ? data.filter((item) => item.Shrimp_Species === selectedSpecies)
    : data;

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#424242", color: "#FFFFFF" }}>
      <Typography variant="h6" sx={{ p: 2, color: "#FFD700" }}>
        Shrimp Growth Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#FFFFFF" }}>Shrimp Species</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>Age (days)</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>Shrimp Weight (g)</TableCell>
            <TableCell sx={{ color: "#FFFFFF" }}>Growth Deviation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: "#FFFFFF" }}>{row.Shrimp_Species || "N/A"}</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>{row.Age_of_Shrimp_days || "N/A"}</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>
                  {typeof row.Shrimp_Weight_g === 'number' ? row.Shrimp_Weight_g.toFixed(2) : "N/A"}
                </TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>{row.Growth_Deviation || "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} sx={{ color: "#FFFFFF", textAlign: "center" }}>
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShrimpGrowthTable;