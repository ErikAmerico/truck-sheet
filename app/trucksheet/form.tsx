"use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function TruckSheetForm() {
  const [expanded, setExpanded] = React.useState<string | false>("panel3");
  const [truck, setTruck] = React.useState("");
  const [fuel, setFuel] = React.useState<number | "">("");
  const [mileage, setMileage] = React.useState<number | "">("");
  //use truckId in place of 1 in the fetch call
  //const [truckId, setTruckId] = React.useState<number | "">("");
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleTruckChange = (event: SelectChangeEvent) => {
    setTruck(event.target.value);
    //set truckId to the truck id associated with the truck number
  };

  const handleAccordianChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/trucksheets/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //need to get the correct truck id associated with the truck number
      body: JSON.stringify({ date: new Date(), fuel, mileage, truckId: 1 }),
    });
    if (response.ok) {
      console.log("Truck sheet created");
    } else {
      console.error("Failed to create truck sheet");
    }
  };

  const menuProps = {
    PaperProps: {
      sx: {
        "& .MuiMenuItem-root": {
          display: "inline-block",
          width: "50%",
          boxSizing: "border-box",
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <FormControl
          sx={{
            m: 1,
            minWidth: 120,
            backgroundColor: "rgb(47, 50, 55)",
            borderRadius: 1,
            boxShadow: "0 0 20px 1px rgba(9, 159, 255, 0.5)",
          }}
          size="small"
        >
          <InputLabel id="truck-number-label" sx={{ color: "white" }}>
            Truck #
          </InputLabel>
          <Select
            labelId="truck-number-label"
            id="truck-number-select"
            value={truck}
            onChange={handleTruckChange}
            MenuProps={menuProps}
            sx={{
              color: "white",
              borderBottom: "1px solid gray",
              borderLeft: "1px solid gray",
              borderRight: "1px solid gray",
            }}
          >
            {/* associate truck number with truck id */}
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={101}>101</MenuItem>
            <MenuItem value={102}>102</MenuItem>
            <MenuItem value={103}>103</MenuItem>
            <MenuItem value={104}>104</MenuItem>
            <MenuItem value={105}>105</MenuItem>
            <MenuItem value={106}>106</MenuItem>
            <MenuItem value={107}>107</MenuItem>
            <MenuItem value={108}>108</MenuItem>
            <MenuItem value={109}>109</MenuItem>
            <MenuItem value={110}>110</MenuItem>
            <MenuItem value={111}>111</MenuItem>
            <MenuItem value={112}>112</MenuItem>
            <MenuItem value={113}>113</MenuItem>
            <MenuItem value={114}>114</MenuItem>
          </Select>
        </FormControl>
        <Typography
          sx={{
            color: "white",
            mr: 1,
            border: "1px solid gray",
            borderRadius: 1,
            padding: "10px",
            boxShadow: "0 0 20px 1px rgba(9, 159, 255, 0.5)",
          }}
        >
          {formattedDate}
        </Typography>
      </Box>

      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleAccordianChange("panel1")}
        sx={{
          boxShadow: expanded === "panel1" ? "0 0 10px 1px white" : "none",
        }}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Truck Parts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Click any defective item and give details under &quot;Remarks&quot;
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleAccordianChange("panel2")}
        sx={{
          boxShadow: expanded === "panel2" ? "0 0 10px 1px white" : "none",
        }}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Equipment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This is where you would check off equipment counts
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleAccordianChange("panel3")}
        sx={{
          boxShadow: expanded === "panel3" ? "0 0 10px 1px white" : "none",
        }}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Fuel & Mileage</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ padding: "10px" }}>
            <TextField
              label="Fuel"
              type="number"
              value={fuel}
              onChange={(e) => setFuel(Number(e.target.value))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              fullWidth
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleAccordianChange("panel4")}
        sx={{
          boxShadow: expanded === "panel4" ? "0 0 10px 1px white" : "none",
        }}
      >
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography>Remarks</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <TextField id="remarks-textfield" multiline rows={8} fullWidth />
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel5"}
        onChange={handleAccordianChange("panel5")}
        sx={{
          boxShadow: expanded === "panel5" ? "0 0 10px 1px white" : "none",
        }}
      >
        <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
          <Typography>Final Checks</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This is where you would check off the boxes that were around the
            signature line
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2, backgroundColor: "rgb(9, 159, 255)" }}
      >
        Submit
      </Button>
    </form>
  );
}
