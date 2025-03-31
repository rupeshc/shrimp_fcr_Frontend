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

const FeedFCRTable = ({ data, selectedSpecies }) => {
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
        No Feed & FCR Data Available
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
        Feed and FCR Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Shrimp Species</TableCell>
            <TableCell>Total Feed Consumed (g/day)</TableCell>
            <TableCell>Harvest Yield Prediction (kg/ha)</TableCell>
            <TableCell>Adjusted FCR</TableCell>
            <TableCell>Pond Area (m²)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.Shrimp_Species}</TableCell>
              <TableCell>{row.Total_Feed_Consumed_per_Day_g}</TableCell>
              <TableCell>{row.Harvest_Yield_Prediction_kg_ha}</TableCell>
              <TableCell>{row.Adjusted_FCR}</TableCell>
              <TableCell>{row.Pond_Area_m2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeedFCRTable;