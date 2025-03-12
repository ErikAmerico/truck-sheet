import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import "./addOfficeEmployeeModalAndButton.css";
import { useState, FormEvent } from "react";

export default function AddOfficeEmployeeModal({
  onOfficeEmployeeAdded,
  setSelectedUser,
}: {
  onOfficeEmployeeAdded: () => void;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<{
      name: string;
      id: number;
      firstName: string;
      lastName: string;
      username: string;
    } | null>
  >;
}) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
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

    const officeEmployee = { firstName, lastName, username, password };

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASEURL + "/api/employees/addofficeemployee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(officeEmployee),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to create office employee");
        throw new Error(result.error || "Failed to create office employee");
      }

      const result = await response.json();
      console.log("Office employee created successfully:", result);

      setSuccess("Office employee added!");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      handleClose();
      //function to refresh the ui when a new office employee is added
      onOfficeEmployeeAdded();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error creating office employee:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="contained"
        id="officeEmployee-modal-button"
      >
        Add Employee
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          id="officeEmployee-modal-box"
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {error ? (
            <Typography
              id="officeEmployee-error-title"
              variant="h6"
              component="h2"
            >
              {error}
            </Typography>
          ) : (
            <Typography
              id="officeEmployee-modal-title"
              variant="h6"
              component="h2"
            >
              Office Employee Details
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
            required
            id="password"
            label="Password"
            margin="normal"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            id="officeEmployee-submit-button"
          >
            Create Office Employee
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
    </div>
  );
}
