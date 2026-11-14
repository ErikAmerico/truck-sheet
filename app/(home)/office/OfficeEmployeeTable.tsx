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
import AddOfficeEmployeeModal from "./AddOfficeEmployeeModalAndButton";
import UpdateOfficeEmployeeModal from "./UpdateOfficeEmployeeModalAndButton";
import "./officeEmployeeTable.css";
import { useState, useEffect, MouseEvent, useMemo } from "react";
import pusherClient from "../../../lib/pusherClient";

interface OfficeEmployee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

const headCells = [
  {
    id: "firstName",
    label: "First Name",
    sortable: true,
  },
  { id: "lastName", label: "Last Name", sortable: true },
  { id: "username", label: "Username", sortable: true },
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
    event: MouseEvent<unknown>,
    property: keyof OfficeEmployee
  ) => void;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof OfficeEmployee) => (event: MouseEvent<unknown>) => {
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
            id="officeEmployee-table-head-cell"
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id as keyof OfficeEmployee)}
                id="officeEmployee-table-sort-label"
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
  // const { selectedUser } = props;

  return (
    <Toolbar
      id="officeEmployee-toolbar"
      className={selectedUser ? "selected" : ""}
    >
      {selectedUser ? (
        <Typography
          className="officeEmployee-subtitle"
          variant="h6"
          component="div"
        >
          Selected: {selectedUser ? selectedUser.name : null}
        </Typography>
      ) : (
        <Typography
          className="officeEmployee-subtitle"
          variant="h6"
          id="officeEmployee-tableTitle"
          component="div"
        >
          Employees
        </Typography>
      )}
      {selectedUser ? (
        <UpdateOfficeEmployeeModal selectedUser={selectedUser} />
      ) : (
        <AddOfficeEmployeeModal />
      )}
    </Toolbar>
  );
}

export default function OfficeEmployeeTable({
  initialEmployees,
}: {
  initialEmployees: OfficeEmployee[];
}) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof OfficeEmployee>("lastName");
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  } | null>(null);
  //setting employees as initialEmployees, before creating a new employee
  const [employees, setEmployees] =
    useState<OfficeEmployee[]>(initialEmployees);

  useEffect(() => {
    const channel = pusherClient.subscribe("real-time-office-employees");
    const deleteChannel = pusherClient.subscribe("real-time-employees");

    // Listen for new office employees
    channel.bind(
      "office-employee-added",
      (data: { newEmployee: OfficeEmployee }) => {
        setEmployees((prev) => {
          const exists = prev.some(
            (employee) => employee.id === data.newEmployee.id
          );
          return exists ? prev : [...prev, data.newEmployee]; // Add new employee if it doesn't already exist
        });
      }
    );

    // Listen for office employee updates
    channel.bind(
      "office-employee-updated",
      (data: { updatedEmployee: OfficeEmployee }) => {
        setEmployees((prev) =>
          prev.map((employee) =>
            employee.id === data.updatedEmployee.id
              ? data.updatedEmployee
              : employee
          )
        );
        setSelectedUser(null);
      }
    );

    // Listen for office employee deletions
    deleteChannel.bind("employee-deleted", (data: { id: number }) => {
      console.log("Received delete event:", data); // Debugging log
      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== data.id)
      );
      setSelectedUser(null);
    });

    return () => {
      pusherClient.unsubscribe("real-time-office-employees");
      pusherClient.unsubscribe("real-time-employees");
    };
  }, []);

  const handleRequestSort = (
    _: MouseEvent<unknown>,
    property: keyof OfficeEmployee
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (_: MouseEvent<unknown>, id: number) => {
    const selectedOfficeEmployee = employees.find((row) => row.id === id);
    const selectedUser = selectedOfficeEmployee
      ? {
          name: `${selectedOfficeEmployee.firstName} ${selectedOfficeEmployee.lastName}`,
          id: selectedOfficeEmployee.id,
          firstName: selectedOfficeEmployee.firstName,
          lastName: selectedOfficeEmployee.lastName,
          username: selectedOfficeEmployee.username,
        }
      : null;

    setSelectedUser((prevSelected) =>
      prevSelected && prevSelected.id === selectedUser?.id ? null : selectedUser
    );
  };

  const sortedRows = useMemo(
    () => employees.slice().sort(getComparator(order, orderBy)),
    [order, orderBy, employees]
  );

  return (
    <Box className="officeEmployee-table-container">
      <Paper className="officeEmployee-paper">
        <EnhancedTableToolbar selectedUser={selectedUser} />
        <TableContainer className="officeEmployee-tableContainer">
          <Table
            aria-labelledby="officeEmployee-tableTitle"
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
                    className="officeEmployee-table-row"
                  >
                    <TableCell align="center" className="officeEmployee-data">
                      {row.firstName}
                    </TableCell>
                    <TableCell align="center" className="officeEmployee-data">
                      {row.lastName}
                    </TableCell>
                    <TableCell align="center" className="officeEmployee-data">
                      {row.username}
                    </TableCell>
                  </TableRow>
                );
              })}
              {employees.length === 0 && (
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
