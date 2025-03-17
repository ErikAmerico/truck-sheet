"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          maxHeight: "80vh",
          minHeight: "80vh",
          overflow: "auto",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          "&:last-child": {
            borderBottom: "none",
          },
          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.12)",
            "& td, & th": {
              backgroundColor: "rgba(25, 118, 210, 0.12)",
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "white",
          backgroundColor: "rgb(37, 40, 45)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          fontSize: "14px",
        },
        head: {
          backgroundColor: "rgb(37, 40, 45)",
          fontWeight: "bold",
          borderTop: "2px solid rgba(9, 159, 255, 0.5)",
          borderBottom: "2px solid rgba(9, 159, 255, 0.5)",
          color: "white",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(37, 40, 45)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: "white !important",
          "&:hover": {
            color: "lightgray !important",
          },
        },
        icon: {
          color: "white !important",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#222",
          fontSize: "12px",
        },
      },
    },
  },
});

export default theme;
