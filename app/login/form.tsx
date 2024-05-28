"use client";
import { useState } from "react";
import SignIn from "./signIn";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await SignIn(username, password);
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        required
        id="username"
        type="text"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <input
        required
        id="password"
        type="text"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button type="submit">Sign in</button>
    </form>
  );
};
