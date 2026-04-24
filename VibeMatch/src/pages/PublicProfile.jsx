import { useParams, Link } from "react-router-dom";
import { getSharedProfileById } from "../services/shareprofile";

function normalizeUsername(name = "") {
  return name.toLowerCase().replace(/\s+/g, "");
}

function getSharedProfileByUsername(username) {
  const profiles =
    JSON.parse(localStorage.getItem("vibematch_public_profiles")) || [];

  return profiles.find(
    (profile) => normalizeUsername(profile.display_name) === username
  );
}

export default function PublicProfile() {
  const { shareId, username } = useParams();

  const profile = shareId
    ? getSharedProfileById(shareId)
    : getSharedProfileByUsername(username);

  if (!profile) {
    return (
      <div className="min-h-screen bg-black p-10 text-white">
        <h1 className="text-3xl font-bold">Perfil não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          {profile.image && (
            <img
              src={profile.image}
              alt={profile.display_name}
              className="h-20 w-20 rounded-full object-cover"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold">{profile.display_name}</h1>
            <p className="text-zinc-400">{profile.country}</p>
          </div>
        </div>

        <div className="mb-6">
          <Link
            to={`/match/${profile.shareId || ""}`}
            className="rounded-xl bg-green-500 px-4 py-2 font-semibold text-black"
          >
            Ver match comigo
          </Link>
        </div>
      </div>
    </div>
  );
}