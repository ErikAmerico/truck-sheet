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
    event: React.MouseEvent<unknown>,
    property: keyof OfficeEmployee
  ) => void;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof OfficeEmployee) => (event: React.MouseEvent<unknown>) => {
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

  fetchOfficeEmployees: () => void;
}

function EnhancedTableToolbar({
  selectedUser,
  fetchOfficeEmployees,
}: EnhancedTableToolbarProps) {
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
        /* passing fetchOfficeEmployees function as onOfficeEmployeeAdded to the modal
      so when a new office employee is created, it can call fetchOfficeEmployees and update UI */
        <AddOfficeEmployeeModal onOfficeEmployeeAdded={fetchOfficeEmployees} />
      )}
    </Toolbar>
  );
}

export default function OfficeEmployeeTable({
  initialEmployees,
}: {
  initialEmployees: OfficeEmployee[];
}) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof OfficeEmployee>("lastName");
  const [selectedUser, setSelectedUser] = React.useState<{
    name: string;
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  } | null>(null);
  //setting employees as initialEmployees, before creating a new employee
  const [employees, setEmployees] =
    React.useState<OfficeEmployee[]>(initialEmployees);

  const fetchOfficeEmployees = async () => {
    //this will get called from the addOfficeEmployee modal when a new employee is created
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/api/employees/getofficeemployees`,
        {
          cache: "no-store",
          // Allegedly Prevents caching to always fetch the latest data
        }
      );
      const newEmployees = await response.json();
      setEmployees(newEmployees);
    } catch (error) {
      console.error("Error fetching office employees:", error);
    }
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof OfficeEmployee
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
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

  const sortedRows = React.useMemo(
    () => employees.slice().sort(getComparator(order, orderBy)),
    [order, orderBy, employees]
  );

  return (
    <Box className="officeEmployee-table-container">
      <Paper className="officeEmployee-paper">
        <EnhancedTableToolbar
          selectedUser={selectedUser}
          //pass to the toolbar, to then be passed to addOfficeEmployee modal
          fetchOfficeEmployees={fetchOfficeEmployees}
        />
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
                    onClick={(event: React.MouseEvent<unknown>) =>
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
