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
import { useState, useEffect, MouseEvent, useMemo } from "react";
import pusherClient from "@/lib/pusherClient";

interface Driver {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

interface DriversLastReport extends Driver {
  lastReport?: {
    date: string;
    truckNumber: number;
  } | null;
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
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Driver) => void;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Driver) => (event: MouseEvent<unknown>) => {
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

function EnhancedTableToolbar({ selectedUser }: EnhancedTableToolbarProps) {
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
  initialDrivers: DriversLastReport[];
}

export default function DriverTable({ initialDrivers }: DriverTableProps) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Driver>("lastName");
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  } | null>(null);
  //setting drivers as initialDrivers, before creating a new driver
  const [drivers, setDrivers] = useState<DriversLastReport[]>(initialDrivers);

  useEffect(() => {
    //Subscribe to a Pusher channel named "real-time-drivers".
    //created in api/trucksheets/create/route.ts
    //Connects to Pusher's real-time WebSocket server.
    //Listens to the "real-time-drivers" channel.
    const channel = pusherClient.subscribe("real-time-drivers");
    const deleteChannel = pusherClient.subscribe("real-time-employees");

    // Listen for new drivers
    channel.bind("driver-added", (data: { newDriver: DriversLastReport }) => {
      setDrivers((prev) => {
        const exists = prev.some((driver) => driver.id === data.newDriver.id);
        return exists ? prev : [...prev, data.newDriver]; // Prevent duplicates
      });
      setSelectedUser(null);
    });

    // Listen for driver updates
    channel.bind(
      "driver-updated",
      (data: { updatedDriver: DriversLastReport }) => {
        setDrivers((prev) =>
          prev.map((driver) =>
            driver.id === data.updatedDriver.id ? data.updatedDriver : driver
          )
        );
        setSelectedUser(null);
      }
    );

    // Listen for driver deletions
    deleteChannel.bind("employee-deleted", (data: { id: number }) => {
      setDrivers((prev) => prev.filter((driver) => driver.id !== data.id));
      setSelectedUser(null);
    });

    channel.bind(
      //Listen for an event called "new-driver-trucksheet".
      //Wiats for "new-driver-trucksheet" event to be emitted by the server.
      "new-driver-trucksheet",
      //data will contain employeeId and the last report(new truck sheet)
      (data: {
        employeeId: number;
        lastReport: { date: string; truckNumber: number } | null;
      }) => {
        //When event is received, call setDrivers
        //find matching driver using employeeId
        //update their lastReport with the new data
        setDrivers((prev) =>
          //map over drivers, if driver id matches the employeeId from the event
          //update the lastReport with the new data
          prev.map((driver) =>
            driver.id === data.employeeId
              ? { ...driver, lastReport: data.lastReport }
              : driver
          )
        );
      }
    );

    //clea up the subscription when component unmounts
    //prevent memory leaks
    return () => {
      pusherClient.unsubscribe("real-time-drivers");
      pusherClient.unsubscribe("real-time-employees");
    };
  }, []);

  const handleRequestSort = (
    _: MouseEvent<unknown>,
    property: keyof Driver
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: MouseEvent<unknown>, id: number) => {
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

  const sortedRows = useMemo(
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
                    onClick={(event: MouseEvent<unknown>) =>
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
                      {/* making sure date is in correct format,
                      pusherClient was sending it incorrectly */}
                      {row.lastReport
                        ? `${new Date(
                            row.lastReport.date
                          ).toLocaleDateString()} for Truck ${
                            row.lastReport.truckNumber
                          }`
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
