import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expiry");
    localStorage.removeItem("spotify_user");
    localStorage.removeItem("spotify_code_verifier");
    localStorage.removeItem("spotify_auth_state");
    sessionStorage.removeItem("spotify_last_callback_code");

    navigate("/");
  }

  return (
    <nav
      style={{
        width: "100%",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd",
        marginBottom: "32px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          cursor: "pointer",
        }}
        onClick={() => navigate("/dashboard")}
      >
        VibeMatch
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "white",
            cursor: "pointer",
          }}
        >
          Dashboard
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#1DB954",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
