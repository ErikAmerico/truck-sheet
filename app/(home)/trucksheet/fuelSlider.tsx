"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

function valuetext(value: number) {
  switch (value) {
    case 0:
      return "Empty";
    case 1:
      return "1/8";
    case 2:
      return "1/4";
    case 3:
      return "3/8";
    case 4:
      return "1/2";
    case 5:
      return "5/8";
    case 6:
      return "3/4";
    case 7:
      return "7/8";
    case 8:
      return "Full";
    default:
      return `${value}`;
  }
}

interface FuelSliderProps {
  setFuel: (value: number) => void;
}

const marks = [
  { value: 0, label: "Empty" },
  { value: 1, label: "1/8" },
  { value: 2, label: "1/4" },
  { value: 3, label: "3/8" },
  { value: 4, label: "1/2" },
  { value: 5, label: "5/8" },
  { value: 6, label: "3/4" },
  { value: 7, label: "7/8" },
  { value: 8, label: "Full" },
];

export default function FuelSlider({ setFuel }: FuelSliderProps) {
  const handleFuelChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    setFuel(value as number);
  };

  return (
    <Box sx={{ width: 350, marginTop: 5 }}>
      <Typography
        id="discrete-slider"
        gutterBottom
        sx={{
          display: "flex",
          justifyContent: "center",
          border: "1px solid rgba(9, 159, 255, 0.5)",
          borderRadius: 5,
          padding: "5px",
          color: "rgb(37, 40, 45)",
        }}
      >
        Fuel Level
      </Typography>
      <Slider
        aria-label="Fuel Level"
        defaultValue={0}
        getAriaValueText={valuetext}
        marks={marks}
        step={null}
        min={0}
        max={8}
        onChange={handleFuelChange}
      />
    </Box>
  );
}
