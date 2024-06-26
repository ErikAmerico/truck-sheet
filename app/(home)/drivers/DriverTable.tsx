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
import UpdateDriverModal from "./UpdateDriverModalAndButton";
import "./driverTable.css";

interface Driver {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

interface DriversLastReport extends Driver {
  lastReport: {
    date: string;
    truckNumber: number;
  };
}

const headCells = [
  {
    id: "firstName",
    label: "First Name",
    sortable: true,
  },
  { id: "lastName", label: "Last Name", sortable: true },
  { id: "username", label: "Username", sortable: true },
  { id: "lastreport", label: "Last Reported Truck Sheet", sortable: false },
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
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
            id="driver-table-head-cell"
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id as keyof Driver)}
                id="driver-table-sort-label"
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  selectedUser: {
    name: string;
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  } | null;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { selectedUser } = props;

  return (
    <Toolbar id="driver-toolbar" className={selectedUser ? "selected" : ""}>
      {selectedUser ? (
        <Typography className="driver-subtitle" variant="h6" component="div">
          Selected: {selectedUser ? selectedUser.name : null}
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
      {selectedUser ? (
        <UpdateDriverModal selectedUser={selectedUser} />
      ) : (
        <AddDriverModal />
      )}
    </Toolbar>
  );
}

interface DriverTableProps {
  drivers: DriversLastReport[];
}

export default function DriverTable({ drivers }: DriverTableProps) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Driver>("lastName");
  const [selectedUser, setSelectedUser] = React.useState<{
    name: string;
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  } | null>(null);

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
      ? {
          name: `${selectedDriver.firstName} ${selectedDriver.lastName}`,
          id: selectedDriver.id,
          firstName: selectedDriver.firstName,
          lastName: selectedDriver.lastName,
          username: selectedDriver.username,
        }
      : null;

    setSelectedUser((prevSelected) =>
      prevSelected && prevSelected.id === selectedUser?.id ? null : selectedUser
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
              selectedUser={selectedUser ? selectedUser.name : null}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {sortedRows.map((row) => {
                const isItemSelected =
                  selectedUser &&
                  selectedUser.name === `${row.firstName} ${row.lastName}`;
                return (
                  <TableRow
                    hover
                    onClick={(event: React.MouseEvent<unknown>) =>
                      handleClick(event, row.id)
                    }
                    key={row.id}
                    selected={isItemSelected ? true : false}
                    className="driver-table-row"
                  >
                    <TableCell align="center" className="driver-data">
                      {row.firstName}
                    </TableCell>
                    <TableCell align="center" className="driver-data">
                      {row.lastName}
                    </TableCell>
                    <TableCell align="center" className="driver-data">
                      {row.username}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="driver-data"
                      id="driver-last-report"
                    >
                      {row.lastReport
                        ? `${row.lastReport.date} for Truck ${row.lastReport.truckNumber}`
                        : "No reports"}
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
