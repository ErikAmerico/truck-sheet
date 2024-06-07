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
import FuelSlider from "./fuelSlider";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";

export default function TruckSheetForm() {
  const [expanded, setExpanded] = React.useState<string | false>("panel3");
  const [selectedTruck, setSelectedTruck] = React.useState("");
  const [fuel, setFuel] = React.useState<number | "">("");
  const [mileage, setMileage] = React.useState<number | "">("");
  const [trucksFromDB, setTrucksFromDB] = React.useState<any[]>([]);
  const [selectedTruckId, setSelectedTruckId] = React.useState<number | "">("");
  const [mileageError, setMileageError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [checkBoxes, setCheckBoxes] = React.useState<Object>({});

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
    //setFuel to 0, because when the fuel slider first mounts the value is null
    setFuel(0);
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckBoxes({
      ...checkBoxes,
      [event.target.name]: event.target.checked,
    });
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
        ...checkBoxes,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Truck sheet created");
      setSuccess("Truck sheet submitted!");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      setMileage("");
      setSelectedTruck("");
      setSelectedTruckId("");
    } else {
      console.error("Failed to create truck sheet");
      setMileageError(result.error);
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

  const handleMileageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMileageError(null);
    const value = event.target.value;
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setMileage(value === "" ? "" : Number(value));
    }
  };

  const handleMileageKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const invalidChars = ["e", "E", "+", "-"];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  };

  const sortedTrucksFromDB = React.useMemo(() => {
    return trucksFromDB.slice().sort((a, b) => a.number - b.number);
  }, [trucksFromDB]);

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
            required
            sx={{
              color: "white",
              border: "1px solid rgba(9, 159, 255, 0.5)",
            }}
          >
            {Array.isArray(sortedTrucksFromDB) &&
              sortedTrucksFromDB.map((truck: any) => (
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
          <Typography>Truck Inspection</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            sx={{
              fontSize: ".8rem",
            }}
          >
            Check any defective item and give details under &quot;Remarks&quot;.
          </Typography>
          <FormGroup onChange={handleCheckboxChange}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Air Compressor"
                  name="aircompressor"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Air Lines"
                  name="airlines"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Battery"
                  name="battery"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Brake Accessories"
                  name="brakeaccessories"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Brakes"
                  name="brakes"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Carburetor"
                  name="carburetor"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Clutch"
                  name="clutch"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Defroster"
                  name="defroster"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Drive Line"
                  name="driveline"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Engine"
                  name="engine"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Fuel Tanks"
                  name="fueltanks"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Heater"
                  name="heater"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Horn"
                  name="horn"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Lights"
                  name="lights"
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    ml: 4,
                    color: "gray",
                  }}
                >
                  <p>Head-Stop</p>
                  <p>Tail-Dash</p>
                  <p>Turn Signals</p>
                </Box>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Mirrors"
                  name="mirrors"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Muffler"
                  name="muffler"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Oil Pressure"
                  name="oilpressure"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="On-Board Recorder"
                  name="onboardrecorder"
                  sx={{
                    ".MuiFormControlLabel-label": {
                      fontSize: "15px",
                    },
                  }}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Radiator"
                  name="radiator"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Rear End"
                  name="rearend"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Reflectors"
                  name="reflectors"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Safety Equipment"
                  name="safetyequipment"
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "10px",
                    ml: 4,
                    color: "gray",
                  }}
                >
                  <p>Fire Extinguisher</p>
                  <p>Flags, Flares, Fuses</p>
                  <p>Spare bulbs & fuses</p>
                  <p>Spare Seal Beam</p>
                </Box>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Springs"
                  name="springs"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Starter"
                  name="starter"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Steering"
                  name="steering"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Tachograph"
                  name="tachograph"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Tires"
                  name="tires"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Transmission"
                  name="transmission"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Wheels"
                  name="wheels"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Windows"
                  name="windows"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Windshield Wipers"
                  name="windshieldwipers"
                />
              </Grid>
            </Grid>
          </FormGroup>
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
          <Typography>Equipment Inspection</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Coming Soon!</Typography>
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
          {mileageError ? (
            <Typography sx={{ color: "red" }}>{mileageError}</Typography>
          ) : (
            <Typography>Fuel & Mileage</Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ padding: "10px" }}>
            <TextField
              label="Mileage"
              required
              type="number"
              value={mileage}
              onChange={handleMileageChange}
              onKeyDown={handleMileageKeyDown}
              inputProps={{ pattern: "[0-9]*" }}
              fullWidth
              sx={{ mb: 5 }}
            />
            <Divider />
            <FuelSlider setFuel={setFuel} />
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
            <TextField
              id="remarks-textfield"
              multiline
              rows={8}
              fullWidth
              defaultValue={"DB integration coming soon!"}
            />
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
          <Typography>Final Review</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Coming Soon!</Typography>
        </AccordionDetails>
      </Accordion>
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          mt: 2,
          ml: 1,
          padding: "10px",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "rgb(9, 159, 255)",
            width: "118px",
            boxShadow: "0 0 5px 1px rgb(9, 159, 255)",
          }}
        >
          Submit
        </Button>
      </Box>
      {success && (
        <Alert
          severity="success"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
        >
          {success}
        </Alert>
      )}
    </form>
  );
}
