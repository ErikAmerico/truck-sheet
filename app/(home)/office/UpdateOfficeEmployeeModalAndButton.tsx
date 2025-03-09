import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import "./updateOfficeEmployeeModalAndButton.css";

interface UpdateOfficeEmployeeModalProps {
  selectedUser: {
    name: string;
    id: number;
    firstName: string;
    lastName: string;
    username: string;
  };
}

export default function UpdateOfficeEmployeeModal(
  selectedUser: UpdateOfficeEmployeeModalProps
) {
  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
    setFirstName(selectedUser.selectedUser.firstName);
    setLastName(selectedUser.selectedUser.lastName);
    setUsername(selectedUser.selectedUser.username);
  };
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedOfficeEmployee = {
      id: selectedUser.selectedUser.id,
      firstName,
      lastName,
      username,
      password,
    };

    try {
      const response = await fetch(
        process.env.BASEURL + "/api/employees/updateofficeemployee",
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
              Update {selectedUser.selectedUser.name}&apos;s Information
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
