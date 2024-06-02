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
import AddDriverModal from "./AddDriverModalAndButton";
import "./driverTable.css";

interface Driver {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

const headCells = [
  {
    id: "firstName",
    numeric: false,
    disablePadding: false,
    label: "First Name",
  },
  { id: "lastName", numeric: false, disablePadding: false, label: "Last Name" },
  { id: "username", numeric: false, disablePadding: true, label: "Username" },
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
  selectedUser: string | null;
  order: Order;
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Driver
  ) => void;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Driver) => (event: React.MouseEvent<unknown>) => {
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
              onClick={createSortHandler(headCell.id as keyof Driver)}
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
  selectedUser: string | null;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { selectedUser } = props;

  return (
    <Toolbar id="driver-toolbar" className={selectedUser ? "selected" : ""}>
      {selectedUser ? (
        <Typography className="driver-subtitle" variant="h6" component="div">
          Selected: {selectedUser}
        </Typography>
      ) : (
        <Typography
          className="driver-subtitle"
          variant="h6"
          id="driver-tableTitle"
          component="div"
        >
          Drivers
        </Typography>
      )}
      {selectedUser ? null : <AddDriverModal />}
    </Toolbar>
  );
}

interface DriverTableProps {
  drivers: Driver[];
}

export default function DriverTable({ drivers }: DriverTableProps) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Driver>("lastName");
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Driver
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedDriver = drivers.find((row) => row.id === id);
    const selectedUser = selectedDriver
      ? `${selectedDriver.firstName} ${selectedDriver.lastName}`
      : null;
    setSelectedUser((prevSelected) =>
      prevSelected === selectedUser ? null : selectedUser
    );
  };

  const sortedRows = React.useMemo(
    () => drivers.slice().sort(getComparator(order, orderBy)),
    [order, orderBy, drivers]
  );

  return (
    <Box className="driver-table-container">
      <Paper className="driver-paper">
        <EnhancedTableToolbar selectedUser={selectedUser} />
        <TableContainer className="driver-tableContainer">
          <Table
            aria-labelledby="driver-tableTitle"
            size={"medium"}
            stickyHeader
          >
            <EnhancedTableHead
              selectedUser={selectedUser}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {sortedRows.map((row) => {
                const isItemSelected =
                  selectedUser === `${row.firstName} ${row.lastName}`;
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    key={row.id}
                    selected={isItemSelected}
                    className="driver-table-row"
                  >
                    <TableCell align="left">{row.firstName}</TableCell>
                    <TableCell align="left">{row.lastName}</TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {row.username}
                    </TableCell>
                  </TableRow>
                );
              })}
              {drivers.length === 0 && (
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
