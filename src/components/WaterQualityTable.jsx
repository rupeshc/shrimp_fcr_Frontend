import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const WaterQualityTable = ({ data, selectedSpecies }) => {
  const filteredData = selectedSpecies
    ? data.filter((item) => item.Shrimp_Species === selectedSpecies)
    : data;

  if (!filteredData || filteredData.length === 0) {
    return (
      <Typography
        variant="h6"
        align="center"
        color="textSecondary"
        sx={{ color: "#FFFFFF", padding: "20px" }}
      >
        No Water Quality Data Available
      </Typography>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 4,
        border: "3px solid #FFFFFF",
        backgroundColor: "#424242",
        "& .MuiTableCell-root": {
          color: "#FFFFFF",
          borderBottom: "1px solid #FFFFFF",
        },
        "& .MuiTableHead-root": {
          backgroundColor: "#333",
        },
      }}
    >
      <Typography
        variant="h6"
        align="center"
        sx={{ py: 2, color: "#FFD700", backgroundColor: "#333" }}
      >
        Water Quality Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Shrimp Species</TableCell>
            <TableCell>Water pH</TableCell>
            <TableCell>Temperature (°C)</TableCell>
            <TableCell>Salinity (ppt)</TableCell>
            <TableCell>Dissolved Oxygen (mg/L)</TableCell>
            <TableCell>Ammonia (mg/L)</TableCell>
            <TableCell>Nitrite (mg/L)</TableCell>
            <TableCell>Alkalinity (mg/L CaCO3)</TableCell>
            <TableCell>Pond Area (m²)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.Shrimp_Species}</TableCell>
              <TableCell>{row.Water_pH}</TableCell>
              <TableCell>{row.Temperature_C}</TableCell>
              <TableCell>{row.Salinity_ppt}</TableCell>
              <TableCell>{row.Dissolved_Oxygen_mg_L}</TableCell>
              <TableCell>{row.Ammonia_mg_L}</TableCell>
              <TableCell>{row.Nitrite_mg_L}</TableCell>
              <TableCell>{row.Alkalinity_mg_L_CaCO3}</TableCell>
              <TableCell>{row.Pond_Area_m2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WaterQualityTable;