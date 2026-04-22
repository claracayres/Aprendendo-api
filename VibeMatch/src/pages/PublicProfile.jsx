import { useParams, Link } from "react-router-dom";
import { getSharedProfileById } from "../services/shareProfile";

export default function PublicProfile() {
  const { shareId } = useParams();
  const profile = getSharedProfileById(shareId);

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <h1 className="text-3xl font-bold">Perfil não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          {profile.image && (
            <img
              src={profile.image}
              alt={profile.displayName}
              className="h-20 w-20 rounded-full object-cover"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold">{profile.displayName}</h1>
            <p className="text-zinc-400">{profile.country}</p>
          </div>
        </div>

        <div className="mb-6">
          <Link
            to={`/match/${shareId}`}
            className="rounded-xl bg-green-500 px-4 py-2 font-semibold text-black"
          >
            Ver match comigo
          </Link>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Top artistas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {profile.topArtists?.map((artist) => (
              <div
                key={artist.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="font-semibold">{artist.name}</p>
                <p className="text-sm text-zinc-400">
                  {artist.genres?.slice(0, 3).join(", ") || "Sem gêneros"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Top músicas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {profile.topTracks?.map((track) => (
              <div
                key={track.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm text-zinc-400">
                  {track.artists?.map((a) => a.name).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}