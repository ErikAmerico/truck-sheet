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
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CreateTruckModal from "./CreateTruckModalAndButton";
import "./truckTable.css";
import FuelGauge from "./FuelGauge";

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

interface Truck {
  id: number;
  number: number;
  trucksheet: {
    mileage: number;
    fuel: number;
    remarks: string;
    date: string;
    employeeId: number;
  }[];
}

const headCells = [
  {
    id: "trucknumber",
    disablePadding: false,
    label: "Truck #",
  },
  { id: "mileage", disablePadding: false, label: "Mileage" },
  { id: "fuel", disablePadding: true, label: "Fuel Level" },
  {
    id: "remarks",
    disablePadding: false,
    label: "Remarks",
  },
  { id: "date", disablePadding: true, label: "Date Reported" },
  { id: "driver", disablePadding: false, label: "Driver" },
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
            align="center"
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
  drivers: { [key: number]: string };
}

export default function TruckTable({ trucks, drivers }: TruckTableProps) {
  const [selectedTruck, setSelectedTruck] = React.useState<string | null>(null);

  const sortedTrucks = React.useMemo(() => {
    return trucks.slice().sort((a, b) => a.number - b.number);
  }, [trucks]);

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
              {sortedTrucks.map((row) => {
                const latestTruckSheet = row.trucksheet[0] || {
                  mileage: 0,
                  fuel: 0,
                };
                const driverName = drivers[latestTruckSheet.employeeId];
                const isItemSelected = selectedTruck === row.number.toString();
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    key={row.id}
                    selected={isItemSelected}
                    className="truck-table-row"
                  >
                    <TableCell align="center" className="truck-data">
                      {row.number}
                    </TableCell>
                    <TableCell align="center" className="truck-data">
                      {latestTruckSheet.mileage}
                    </TableCell>
                    <TableCell align="center" id="truck-fuelgauge-data">
                      <FuelGauge value={latestTruckSheet.fuel} />
                    </TableCell>
                    <TableCell
                      align="center"
                      className="truck-data"
                      id="truck-remarks"
                    >
                      <Tooltip title={latestTruckSheet.remarks}>
                        <span>{latestTruckSheet.remarks}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" className="truck-data">
                      {formatDate(latestTruckSheet.date)}
                    </TableCell>
                    <TableCell align="center" className="truck-data">
                      {driverName}
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
