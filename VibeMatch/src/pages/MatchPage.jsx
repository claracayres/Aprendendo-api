import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getSharedProfileById } from "../services/shareProfile";
import { calculateMatchScore } from "../utils/match";

export default function MatchPage() {
  const { shareId } = useParams();
  const otherUser = getSharedProfileById(shareId);

  const myUser = {
    displayName: JSON.parse(localStorage.getItem("spotify_user"))?.display_name || "Você",
    topArtists: JSON.parse(localStorage.getItem("my_top_artists")) || [],
    topTracks: JSON.parse(localStorage.getItem("my_top_tracks")) || [],
  };

  const result = useMemo(() => {
    if (!otherUser) return null;
    return calculateMatchScore(myUser, otherUser);
  }, [otherUser]);

  if (!otherUser) {
    return <div className="min-h-screen bg-black p-10 text-white">Perfil não encontrado.</div>;
  }

  if (!result) {
    return <div className="min-h-screen bg-black p-10 text-white">Calculando match...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">
          Match com {otherUser.displayName}
        </h1>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-zinc-400">Compatibilidade</p>
          <p className="text-6xl font-bold">{result.percentage}%</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-zinc-400">Artistas</p>
            <p className="text-2xl font-bold">{result.details.artistScore}%</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-zinc-400">Gêneros</p>
            <p className="text-2xl font-bold">{result.details.genreScore}%</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-zinc-400">Músicas</p>
            <p className="text-2xl font-bold">{result.details.trackScore}%</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-3 text-xl font-semibold">Artistas em comum</h2>
            <ul className="space-y-2 text-zinc-300">
              {result.details.commonArtists.length ? (
                result.details.commonArtists.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>Nenhum artista em comum</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-3 text-xl font-semibold">Gêneros em comum</h2>
            <ul className="space-y-2 text-zinc-300">
              {result.details.commonGenres.length ? (
                result.details.commonGenres.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>Nenhum gênero em comum</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}