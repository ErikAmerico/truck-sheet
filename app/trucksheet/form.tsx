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
  const [selectedTruck, setSelectedTruck] = React.useState("");
  const [fuel, setFuel] = React.useState<number | "">("");
  const [mileage, setMileage] = React.useState<number | "">("");
  const [trucksFromDB, setTrucksFromDB] = React.useState("");
  const [selectedTruckId, setSelectedTruckId] = React.useState<number | "">("");

  React.useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await fetch("/api/trucks/gettrucks");
        const data = await response.json();
        setTrucksFromDB(data);
      } catch (error) {
        console.error("Failed to fetch trucks", error);
      }
    };

    fetchTrucks();
  }, []);

  const handleTruckChange = (event: SelectChangeEvent) => {
    setSelectedTruck(event.target.value);
    const selectedTruck = Array.isArray(trucksFromDB)
      ? trucksFromDB.find(
          (truck: any) => truck.number === parseInt(event.target.value, 10)
        )
      : null;
    setSelectedTruckId(selectedTruck ? selectedTruck.id : "");
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
      body: JSON.stringify({
        date: new Date(),
        fuel,
        mileage,
        truckId: selectedTruckId,
      }),
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
          }}
          size="small"
        >
          <InputLabel id="truck-number-label" sx={{ color: "white" }}>
            Truck #
          </InputLabel>
          <Select
            labelId="truck-number-label"
            id="truck-number-select"
            value={selectedTruck}
            onChange={handleTruckChange}
            MenuProps={menuProps}
            sx={{
              color: "white",
              border: "1px solid rgba(9, 159, 255, 0.5)",
            }}
          >
            {Array.isArray(trucksFromDB) &&
              trucksFromDB.map((truck: any) => (
                <MenuItem key={truck.id} value={truck.number}>
                  {truck.number}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
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
