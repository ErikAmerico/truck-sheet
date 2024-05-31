import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "./addDriverModalAndButton.css";

export default function AddDriverModal() {
  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newDriver = { firstName, lastName, username, password };

    try {
      const response = await fetch("/api/employees/adddriver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDriver),
      });

      if (!response.ok) {
        throw new Error("Failed to create driver");
      }

      const result = await response.json();
      console.log("Driver created successfully:", result);

      handleClose();
    } catch (error) {
      console.error("Error creating driver:", error);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" id="modal-button">
        Add Driver
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          id="modal-box"
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Driver Details
          </Typography>
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
            onChange={(e) => setUsername(e.target.value)}
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
          <Button type="submit" variant="contained" id="submit-button">
            Create Driver
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
