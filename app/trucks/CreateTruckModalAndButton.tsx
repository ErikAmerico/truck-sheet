import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "./createTruckModalAndButton.css";

export default function CreateTruckModal() {
  const [open, setOpen] = React.useState(false);
  const [truckNumber, setTruckNumber] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        throw new Error("Failed to create truck");
      }

      const result = await response.json();
      console.log("Truck created successfully:", result);

      handleClose();
    } catch (error) {
      console.error("Error creating truck:", error);
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
          <Typography id="truck-modal-title" variant="h6" component="h2">
            Enter Truck Number
          </Typography>
          <TextField
            required
            id="truck-number"
            label="Truck Number"
            margin="normal"
            fullWidth
            value={truckNumber}
            onChange={(e) => setTruckNumber(e.target.value)}
          />
          <Button type="submit" variant="contained" id="truck-submit-button">
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
