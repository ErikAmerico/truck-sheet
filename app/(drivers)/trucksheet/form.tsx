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
import {
  useState,
  useEffect,
  SyntheticEvent,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useMemo,
} from "react";

export default function TruckSheetForm() {
  const [expanded, setExpanded] = useState<string | false>("panel3");
  const [selectedTruck, setSelectedTruck] = useState("");
  const [fuel, setFuel] = useState<number | "">("");
  const [mileage, setMileage] = useState<number | "">("");
  const [trucksFromDB, setTrucksFromDB] = useState<any[]>([]);
  const [selectedTruckId, setSelectedTruckId] = useState<number | "">("");
  const [mileageError, setMileageError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkBoxes, setCheckBoxes] = useState<Object>({});
  const [remarks, setRemarks] = useState<string>("");
  const [noTruckSelected, setNoTruckSelected] = useState<string | null>(null);
  const [noMilageEntered, setNoMilageEntered] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BASEURL + "/api/trucks/gettrucks"
        );
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
    (panel: string) => (_: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckBoxes({
      ...checkBoxes,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    //prevent keyboard from opening when you click submit on cell phone.
    //hopefully.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (!selectedTruck) {
      setNoTruckSelected("Please select a truck");
      setTimeout(() => {
        setNoTruckSelected(null);
      }, 3000);
      return;
    }

    if (!mileage) {
      setNoMilageEntered("Please enter the mileage");
      setTimeout(() => {
        setNoMilageEntered(null);
      }, 3000);
      return;
    }

    const response = await fetch(
      process.env.NEXT_PUBLIC_BASEURL + "/api/trucksheets/create",
      {
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
          remarks,
        }),
      }
    );

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
      setRemarks("");
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

  const handleMileageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMileageError(null);
    const value = event.target.value;
    if (value.match(/^\d*\.?\d{0,2}$/)) {
      setMileage(value === "" ? "" : Number(value));
    }
  };

  const handleMileageKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ["e", "E", "+", "-"];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  };

  const sortedTrucksFromDB = useMemo(() => {
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
          <Typography
            sx={{
              fontSize: ".8rem",
            }}
          >
            Check off items with wrong counts, note details under
            &quot;Remarks&quot;.
          </Typography>
          <FormGroup onChange={handleCheckboxChange}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="36 Furniture Pads"
                  name="furniturepads"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="6 Burlap Skins"
                  name="burlapskins"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="2 Hump Straps"
                  name="humpstraps"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="15 E-Straps"
                  name="estraps"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="4 Buckle Straps"
                  name="bucklestraps"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="6 Door Stops"
                  name="doorstops"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="4 Blocks"
                  name="blocks"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="1 Fire Extinguisher"
                  name="fireextinguisher"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="1 Set of Reflectors"
                  name="setofreflectors"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="1 Set of Jump. Cables"
                  name="setofjumpercables"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="1 Big Red"
                  name="bigred"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="1 Steel Plate"
                  name="steelplate"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="1 Diamond Plate"
                  name="diamondplate"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="20 Rubber Bands"
                  name="rubberbands"
                />
              </Grid>
            </Grid>
          </FormGroup>
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
              onChange={(e) => setRemarks(e.target.value)}
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
          <Typography
            sx={{
              fontSize: ".8rem",
            }}
          >
            Check off items that meet the criteria.
          </Typography>
          <FormGroup onChange={handleCheckboxChange}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Trash has been removed from the vehicle"
                  name="trashremove"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Condition of the above vehicle is satisfactory"
                  name="conditionsatisfactory"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Above defects corrected"
                  name="defectscorrected"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Above defects need not be corrected for safe operation of vehicle"
                  name="defectsneednocorrection"
                />
              </Grid>
            </Grid>
          </FormGroup>
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
      {noTruckSelected && (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            zIndex: 1000,
            transform: "translate(-50%, -50%)",
            border: "1px solid red",
            borderRadius: "5px",
          }}
        >
          {noTruckSelected}
        </Alert>
      )}
      {noMilageEntered && (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            zIndex: 1000,
            transform: "translate(-50%, -50%)",
            border: "1px solid red",
            borderRadius: "5px",
          }}
        >
          {noMilageEntered}
        </Alert>
      )}
    </form>
  );
}
