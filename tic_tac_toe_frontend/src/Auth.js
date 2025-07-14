import React, { useState } from "react";
import {
  apiRegister,
  apiLogin,
  setToken,
  getToken,
  clearToken,
} from "./api";

// PUBLIC_INTERFACE
export function LoginRegister({ onAuth, loggedInUser, onLogout }) {
  const [isLogin, setIsLogin] = useState(true);
  const [input, setInput] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If logged in, show logout panel
  if (loggedInUser) {
    return (
      <div className="auth-panel">
        <span>Welcome, <b>{loggedInUser}</b></span>
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>
    );
  }

  // Login/Register form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const res = await apiLogin(input);
        setToken(res.access_token);
        onAuth(input.username);
      } else {
        await apiRegister(input);
        // Now login automatically
        const res = await apiLogin(input);
        setToken(res.access_token);
        onAuth(input.username);
      }
    } catch (e) {
      setError(typeof e === "string" ? e : "Authentication failed");
      clearToken();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <input
          className="input"
          type="text"
          placeholder="Username"
          value={input.username}
          autoComplete="username"
          onChange={(e) => setInput((v) => ({ ...v, username: e.target.value }))}
          minLength={3}
          maxLength={30}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={input.password}
          autoComplete={isLogin ? "current-password" : "new-password"}
          onChange={(e) => setInput((v) => ({ ...v, password: e.target.value }))}
          minLength={6}
          required
        />
        <button className="btn btn-large" type="submit" disabled={loading}>
          {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
        </button>
        <div className="switch-auth">
          {isLogin
            ? <span>Don't have an account? <a href="#" onClick={e => { e.preventDefault(); setIsLogin(false); }}>Register</a></span>
            : <span>Already a user? <a href="#" onClick={e => { e.preventDefault(); setIsLogin(true); }}>Login</a></span>
          }
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
