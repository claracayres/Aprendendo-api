import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithSpotify } from "../services/auth";
import ColorBends from "../components/ColorBends";
import Navbar from "../components/HomeNav";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden  text-white">
      <Navbar />
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-primary pointer-events-none">
        <ColorBends
          rotation={90}
          speed={0.2}
          colors={["#5227FF", "#FF9FFC", "#7cff67"]}
          transparent
          autoRotate={0.65}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1.3}
          parallax={0.5}
          noise={0}
          iterations={1}
          intensity={0.5}
          bandWidth={6}
        />
        {/* overlay pra legibilidade */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* CONTEÚDO */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">VibeMatch</h1>
        <button
          onClick={loginWithSpotify}
          className="mt-6 rounded-3xl bg-accent px-6 py-3 font-semibold text-black"
        >
          Entrar com Spotify
        </button>
      </div>
    </div>
  );
}
