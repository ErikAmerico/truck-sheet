import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";
import { auth, signOut } from "auth";
import "./navBar.css";
import DriversButton from "./DriversButton";
import TrucksButton from "./TrucksButton";

export default async function NavBar() {
  const session = await auth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" id="appbar">
        <Toolbar id="nav-toolbar">
          <Image src="/logo.png" alt="Logo" width={140} height={60} priority />
          <Box className="centered-button-container">
            {session?.user.role === "office" ? (
              <DriversButton id="drivers-button" />
            ) : null}
            {session?.user.role === "office" ? (
              <TrucksButton id="trucks-button" />
            ) : null}
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Box id="user-info-container">
            <Typography variant="h6" component="div" id="first-last-name">
              {session?.user.firstName} {session?.user.lastName}
            </Typography>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button type="submit" id="logout-button">
                Logout
              </Button>
            </form>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
