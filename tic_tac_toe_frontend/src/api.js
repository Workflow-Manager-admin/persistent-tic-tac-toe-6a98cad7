//
// API utility functions for Tic Tac Toe frontend.
// Handles authentication, game, move, leaderboard, and history REST calls.
//

const BACKEND_BASE_URL = "http://localhost:8000"; // Adjust if hosted elsewhere

// Utility: Save JWT Access Token to localStorage
export function setToken(token) {
  localStorage.setItem("access_token", token);
}

// Utility: Load JWT Access Token from localStorage
export function getToken() {
  return localStorage.getItem("access_token");
}

// Utility: Remove token
export function clearToken() {
  localStorage.removeItem("access_token");
}

// Helper for authenticated fetch requests
async function authFetch(url, options = {}, withAuth = true) {
  if (!options.headers) options.headers = {};
  if (withAuth) {
    const token = getToken();
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  const res = await fetch(url, options);
  if (res.status === 401) {
    // Unauthorized, clear token
    clearToken();
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err?.detail || err?.msg || res.statusText || "API error";
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function apiRegister({ username, password }) {
  return authFetch(`${BACKEND_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }, false);
}

// PUBLIC_INTERFACE
export async function apiLogin({ username, password }) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  params.append("grant_type", "password");
  return authFetch(`${BACKEND_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  }, false);
}

// PUBLIC_INTERFACE
export async function apiCreateGame(boardSize = 3) {
  return authFetch(`${BACKEND_BASE_URL}/game/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board_size: boardSize }),
  });
}

// PUBLIC_INTERFACE
export async function apiJoinGame(gameId) {
  return authFetch(`${BACKEND_BASE_URL}/game/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game_id: gameId }),
  });
}

// PUBLIC_INTERFACE
export async function apiGetGame(gameId) {
  return authFetch(`${BACKEND_BASE_URL}/game/${gameId}`, {
    method: "GET",
  });
}

// PUBLIC_INTERFACE
export async function apiSubmitMove(gameId, x, y) {
  return authFetch(`${BACKEND_BASE_URL}/game/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game_id: gameId, position_x: x, position_y: y }),
  });
}

// PUBLIC_INTERFACE
export async function apiLeaderboard() {
  return authFetch(`${BACKEND_BASE_URL}/leaderboard`, { method: "GET" }, false);
}

// PUBLIC_INTERFACE
export async function apiHistory() {
  return authFetch(`${BACKEND_BASE_URL}/history`, { method: "GET" });
}
