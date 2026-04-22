import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../services/auth";
import { fetchSpotifyProfile } from "../services/spotify";

export default function Callback() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function handleCallback() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");
        const state = params.get("state");

        if (error) {
          throw new Error("Usuario negou autorizacao ou houve erro no login");
        }

        if (!code) {
          throw new Error("Codigo de autorizacao nao encontrado");
        }

        const tokenData = await getAccessToken(code, state);

        localStorage.setItem("spotify_access_token", tokenData.access_token);
        localStorage.setItem(
          "spotify_token_expiry",
          Date.now() + tokenData.expires_in * 1000,
        );
        localStorage.setItem(
          "spotify_auth_scopes",
          "user-read-private user-read-email user-read-recently-played playlist-read-private user-library-read user-top-read",
        );

        if (tokenData.refresh_token) {
          localStorage.setItem(
            "spotify_refresh_token",
            tokenData.refresh_token,
          );
        }

        const user = await fetchSpotifyProfile();
        localStorage.setItem("spotify_user", JSON.stringify(user));

        window.history.replaceState({}, document.title, "/callback");
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
        alert(error.message);
        navigate("/");
      }
    }

    handleCallback();
  }, [navigate]);

  return <p>Conectando com Spotify...</p>;
}
