"use client";
import { useState } from "react";
import "./form.css";
import SignIn from "./signIn";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Paper from "@mui/material/Paper";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUsernameError(false);
    setPasswordError(false);

    let valid = true;
    if (!username.trim()) {
      setUsernameError(true);
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError(true);
      valid = false;
    }

    if (valid) {
      await SignIn(username, password);
    }
  };
  return (
    <Paper elevation={8} id="login-form-container">
      <h1 id="login-form-title">Login</h1>
      <TextField
        id="username"
        error={usernameError}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
        type="text"
        label={usernameError ? "Username is required" : "Username"}
        autoComplete="off"
        onChange={(e) => {
          setUsernameError(false);
          setUsername(e.target.value);
        }}
        value={username}
      />
      <TextField
        id="password"
        error={passwordError}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
        type="password"
        label={passwordError ? "Password is required" : "Password"}
        onChange={(e) => {
          setPasswordError(false);
          setPassword(e.target.value);
        }}
        value={password}
      />
      <Button
        id="login-form-submit"
        type="submit"
        variant="contained"
        color="primary"
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Paper>
  );
};
