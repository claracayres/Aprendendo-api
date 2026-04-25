import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("spotify_user"));
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 pt-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-6 py-4 backdrop-blur-xl">
          {/* LOGO */}
          <div
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer text-xl font-bold text-white"
          >
            Vibe
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Match
            </span>
          </div>

          {/* LINKS */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:text-white transition"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/match")}
              className="hover:text-white transition"
            >
              Matches
            </button>

            <button className="hover:text-white transition">Mood</button>

            <button className="hover:text-white transition">Perfil</button>
          </div>

          {/* USER + LOGOUT */}
          <div className="flex items-center gap-3">
            {/* USER AVATAR */}
            <div className="flex items-center gap-2">
              {user?.images?.length > 0 && user.images[0]?.url ? (
                <img
                  src={user.images[0].url}
                  alt={user.display_name || "User"}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                  {(user?.display_name?.[0] || "U").toUpperCase()}
                </div>
              )}

              <span className="hidden md:block text-sm text-white/70">
                {user?.display_name}
              </span>
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/80 hover:bg-white/10 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
