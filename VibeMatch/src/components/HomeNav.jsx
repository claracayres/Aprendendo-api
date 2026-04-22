import { useNavigate } from "react-router-dom";
import { loginWithSpotify } from "../services/auth";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer text-white"
        >
          Vibe<span className="bg-gradient-to-br from-primary to-accent-green text-transparent bg-clip-text">Match</span>
        </div>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
          <button
            onClick={() => navigate("/")}
            className="hover:text-white transition"
          >
            Início
          </button>

          <a href="#how" className="hover:text-white transition">
            Como funciona
          </a>

          <a href="#features" className="hover:text-white transition">
            Features
          </a>
        </div>

        {/* BOTÃO */}
        <button
          onClick={loginWithSpotify}
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-5 py-2 rounded-xl transition"
        >
          Entrar com Spotify
        </button>
      </div>
    </nav>
  );
}