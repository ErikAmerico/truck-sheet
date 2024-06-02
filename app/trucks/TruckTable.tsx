"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import CreateTruckModal from "./CreateTruckModalAndButton";
import "./truckTable.css";

interface Truck {
  id: number;
  number: number;
  mileage: number;
  fuel: number;
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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface EnhancedTableProps {
  selectedTruck: string | null;
  order: Order;
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Truck
  ) => void;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Truck) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id as keyof Truck)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
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
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Truck>("mileage");
  const [selectedTruck, setSelectedTruck] = React.useState<string | null>(null);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Truck
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedTruck = trucks.find((row) => row.id === id);
    setSelectedTruck((prevSelected) =>
      prevSelected === selectedTruck?.number.toString()
        ? null
        : selectedTruck?.number.toString() || null
    );
  };

  const sortedRows = React.useMemo(
    () => trucks.slice().sort(getComparator(order, orderBy)),
    [order, orderBy, trucks]
  );

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
            <EnhancedTableHead
              selectedTruck={selectedTruck}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {sortedRows.map((row) => {
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
                    {/* mileage and fuel will come from the latest trucksheet */}
                    <TableCell align="left">{row.mileage}</TableCell>
                    <TableCell align="left">{row.fuel}</TableCell>
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
