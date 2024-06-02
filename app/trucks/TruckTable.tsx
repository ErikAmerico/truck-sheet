"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import CreateTruckModal from "./CreateTruckModalAndButton";
import "./truckTable.css";
import FuelGauge from "./FuelGauge";

interface Truck {
  id: number;
  number: number;
  trucksheet: {
    mileage: number;
    fuel: number;
  }[];
}

const headCells = [
  {
    id: "trucknumber",
    numeric: false,
    disablePadding: false,
    label: "Truck #",
  },
  { id: "mileage", numeric: false, disablePadding: false, label: "Mileage" },
  { id: "fuel", numeric: false, disablePadding: true, label: "Fuel Level" },
];

interface EnhancedTableProps {
  selectedTruck: string | null;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            id="truck-table-head-cell"
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  selectedTruck: string | null;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { selectedTruck } = props;

  return (
    <Toolbar id="truck-toolbar" className={selectedTruck ? "selected" : ""}>
      {selectedTruck ? (
        <Typography className="truck-subtitle" variant="h6" component="div">
          Selected: {selectedTruck}
        </Typography>
      ) : (
        <Typography
          className="truck-subtitle"
          variant="h6"
          id="truck-tableTitle"
          component="div"
        >
          Trucks
        </Typography>
      )}
      {selectedTruck ? null : <CreateTruckModal />}
    </Toolbar>
  );
}

interface TruckTableProps {
  trucks: Truck[];
}

export default function TruckTable({ trucks }: TruckTableProps) {
  const [selectedTruck, setSelectedTruck] = React.useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedTruck = trucks.find((row) => row.id === id);
    setSelectedTruck((prevSelected) =>
      prevSelected === selectedTruck?.number.toString()
        ? null
        : selectedTruck?.number.toString() || null
    );
  };

  return (
    <Box className="truck-table-container">
      <Paper className="truck-paper">
        <EnhancedTableToolbar selectedTruck={selectedTruck} />
        <TableContainer className="truck-tableContainer">
          <Table
            aria-labelledby="truck-tableTitle"
            size={"medium"}
            stickyHeader
          >
            <EnhancedTableHead selectedTruck={selectedTruck} />
            <TableBody>
              {trucks.map((row) => {
                const latestTruckSheet = row.trucksheet[0] || {
                  mileage: 0,
                  fuel: 0,
                };
                const isItemSelected = selectedTruck === row.number.toString();
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    key={row.id}
                    selected={isItemSelected}
                    className="truck-table-row"
                  >
                    <TableCell align="left">{row.number}</TableCell>
                    <TableCell align="left">
                      {latestTruckSheet.mileage}
                    </TableCell>
                    <TableCell align="left" style={{ padding: 0 }}>
                      <FuelGauge value={latestTruckSheet.fuel} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {trucks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
