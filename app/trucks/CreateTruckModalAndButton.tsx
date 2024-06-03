import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import "./createTruckModalAndButton.css";

export default function CreateTruckModal() {
  const [open, setOpen] = React.useState(false);
  const [truckNumber, setTruckNumber] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setTruckNumber("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newTruck = { number: parseInt(truckNumber, 10) };

    try {
      const response = await fetch("/api/trucks/addtruck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTruck),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to create Truck");
        throw new Error(result.error || "Failed to create Truck");
      }

      const result = await response.json();
      console.log("Truck created successfully:", result);

      setSuccess("Truck added!");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      handleClose();
    } catch (error) {
      console.error("Error creating truck:", error);
    }
  };

  const handleTruckNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);
    const value = event.target.value;
    if (value.match(/^\d*$/) && value.length <= 3) {
      setTruckNumber(value);
    }
  };

  const handleTruckNumberKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const invalidChars = ["e", "E", "+", "-", "."];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" id="truck-modal-button">
        Add Truck
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          id="truck-modal-box"
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {error ? (
            <Typography id="truck-error-title" variant="h6" component="h2">
              {error}
            </Typography>
          ) : (
            <Typography id="truck-modal-title" variant="h6" component="h2">
              Enter Truck Number
            </Typography>
          )}
          <TextField
            required
            id="truck-number"
            label="Truck Number"
            margin="normal"
            fullWidth
            value={truckNumber}
            onChange={handleTruckNumberChange}
            onKeyDown={handleTruckNumberKeyDown}
            type="number"
          />
          <Button type="submit" variant="contained" id="truck-submit-button">
            Submit
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
