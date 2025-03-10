import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import ConfirmDeleteModal from "../confirmDeleteModal/ConfirmDeleteModal";
import "./updateOfficeEmployeeModalAndButton.css";
import { useState, FormEvent } from "react";

interface UpdateOfficeEmployeeModalProps {
  selectedUser: {
    name: string;
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  };
  onOfficeEmployeeDeleted: () => void;
}

export default function UpdateOfficeEmployeeModal(
  props: UpdateOfficeEmployeeModalProps
) {
  const { selectedUser, onOfficeEmployeeDeleted } = props;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
    setFirstName(selectedUser.firstName);
    setLastName(selectedUser.lastName);
    setUsername(selectedUser.username);
  };
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const updatedOfficeEmployee = {
      id: selectedUser.id,
      firstName,
      lastName,
      username,
      password,
    };

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASEURL + "/api/employees/updateofficeemployee",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOfficeEmployee),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to update office employee");
        throw new Error(result.error || "Failed to update office employee");
      }

      const result = await response.json();
      console.log("Office Employee updated successfully:", result);

      setSuccess("Office employee updated!");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      handleClose();
    } catch (error) {
      console.error("Error updating office employee:", error);
    }
  };

  const handleDeleteOfficeEmployee = async () => {
    setConfirmOpen(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/api/employees/deleteemployee`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedUser.id }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      console.log(result.message);
      setSuccess("Employee deleted!");
      setTimeout(() => setSuccess(null), 3000);

      handleClose();
      onOfficeEmployeeDeleted();
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete employee"
      );
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        id="officeEmployee-update-modal-button"
      >
        Edit Employee
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          id="officeEmployee-update-modal-box"
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {error ? (
            <Typography
              id="officeEmployee-update-error-title"
              variant="h6"
              component="h2"
            >
              {error}
            </Typography>
          ) : (
            <Typography
              id="officeEmployee-update-modal-title"
              variant="h6"
              component="h2"
            >
              Update {selectedUser.name}&apos;s Information
            </Typography>
          )}
          <TextField
            required
            id="firstName"
            label="First Name"
            margin="normal"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            required
            id="lastName"
            label="Last Name"
            margin="normal"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            required
            id="username"
            label="Username"
            margin="normal"
            fullWidth
            value={username}
            onChange={(e) => {
              setError(null);
              setUsername(e.target.value);
            }}
          />
          <TextField
            id="password"
            label="Password"
            margin="normal"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Typography id="password-note">
            Leaving password blank will retain previous password
          </Typography>
          <Button
            type="submit"
            variant="contained"
            id="officeEmployee-update-submit-button"
          >
            Update Office Employee
          </Button>
          <br />
          <Button
            onClick={() => setConfirmOpen(true)}
            variant="contained"
            color="error"
            id="employee-delete-button"
          >
            Delete Employee
          </Button>
        </Box>
      </Modal>
      {success && (
        <Alert
          severity="success"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
        >
          {success}
        </Alert>
      )}
      <ConfirmDeleteModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteOfficeEmployee}
        message={`Are you sure you want to delete ${selectedUser.name}?`}
      />
    </div>
  );
}
