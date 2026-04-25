import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../services/auth";

export default function Callback() {
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const returnTo = localStorage.getItem("spotify_return_to");
  if (returnTo) {
    localStorage.removeItem("spotify_return_to");
    navigate(returnTo, { replace: true });
  } else {
    navigate("/dashboard", { replace: true });
  }
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
          throw new Error("Usuário negou autorização ou houve erro no login");
        }

        if (!code) {
          throw new Error("Código de autorização não encontrado");
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

        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error(error);
        alert(error.message);
        navigate("/", { replace: true });
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07090D] text-white">
      <p>Conectando com Spotify...</p>
    </div>
  );
}
