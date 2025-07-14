import React, { useState, useEffect } from "react";
import "./App.css";
import { LoginRegister } from "./Auth";
import { GameSession } from "./GameSession";
import { Leaderboard } from "./Leaderboard";
import { GameHistory } from "./GameHistory";
import { getToken, clearToken } from "./api";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [currentView, setCurrentView] = useState("game"); // main, leaderboard, history
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Set theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Try restore user from previous session (token)
  useEffect(() => {
    if (!loggedInUser && getToken()) {
      // For demo, user is not stored, so require login each time; backend may offer /me endpoint in future for persistent auth
    }
  }, [loggedInUser]);

  // Handle logout
  function handleLogout() {
    clearToken();
    setLoggedInUser(null);
  }

  // Navigation: just simple tabs
  function renderNav() {
    return (
      <nav className="navbar">
        <button
          className={
            "nav-btn" + (currentView === "game" ? " nav-btn-active" : "")
          }
          onClick={() => setCurrentView("game")}
        >
          Game
        </button>
        <button
          className={
            "nav-btn" + (currentView === "leaderboard" ? " nav-btn-active" : "")
          }
          onClick={() => setCurrentView("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className={
            "nav-btn" + (currentView === "history" ? " nav-btn-active" : "")
          }
          onClick={() => setCurrentView("history")}
        >
          History
        </button>
        <div className="nav-right">
          <LoginRegister
            loggedInUser={loggedInUser}
            onAuth={setLoggedInUser}
            onLogout={handleLogout}
          />
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </nav>
    );
  }

  // Routing
  function renderPage() {
    if (currentView === "game") {
      return loggedInUser ? (
        <GameSession username={loggedInUser} />
      ) : (
        <div className="center-content">
          <LoginRegister
            loggedInUser={loggedInUser}
            onAuth={setLoggedInUser}
            onLogout={handleLogout}
          />
          <div className="welcome-message">
            <h1>Tic Tac Toe</h1>
            <p>Login or Register to play!</p>
          </div>
        </div>
      );
    }
    if (currentView === "leaderboard") return <Leaderboard />;
    if (currentView === "history")
      return loggedInUser ? <GameHistory /> : <div className="center-content"><p>Please log in to view your history.</p></div>;
    return null;
  }

  return (
    <div className="App">
      {renderNav()}
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
