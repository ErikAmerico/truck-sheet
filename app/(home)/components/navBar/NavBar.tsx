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
import OfficeEmployeesButton from "./OfficeEmployeesButton";
import HomeButton from "./HomeButton";

export default async function NavBar() {
  const session = await auth();

  return (
    <Box>
      <AppBar id="appbar">
        <Toolbar id="nav-toolbar">
          <Image src="/logo.png" alt="Logo" width={135} height={60} priority />
          <Box className="centered-button-container">
            {session?.user.role === "office" ? (
              <HomeButton id="home-button" />
            ) : null}
            {session?.user.role === "office" ? (
              <DriversButton id="drivers-button" />
            ) : null}
            {session?.user.role === "office" ? (
              <TrucksButton id="trucks-button" />
            ) : null}
            {session?.user.role === "office" ? (
              <OfficeEmployeesButton id="office-button" />
            ) : null}
          </Box>

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
