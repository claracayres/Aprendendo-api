import { Music2, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-white/10 bg-[#07090D]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-sm">
          <button
            onClick={() => navigate("/")}
            className="text-left text-3xl font-extrabold tracking-tight text-white"
          >
            Vibe
            <span className="bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#22c55e] bg-clip-text text-transparent">
              Match
            </span>
          </button>

          <p className="mt-3 flex items-center gap-2 text-sm leading-relaxed text-zinc-400">
            <Music2 size={16} className="text-zinc-500" />
            Descubra compatibilidade musical de um jeito divertido e visual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 md:justify-center">
          <a href="#how" className="transition hover:text-white">
            Como funciona
          </a>
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <button
            onClick={() => navigate("/dashboard")}
            className="transition hover:text-white"
          >
            Dashboard
          </button>
        </div>

        <div className="text-sm text-zinc-500 md:text-right">
          <p>© 2026 VibeMatch</p>
          <p className="mt-2 flex items-center gap-1 md:justify-end">
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}