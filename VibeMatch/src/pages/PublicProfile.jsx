import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSharedProfileByShareId,
  getSharedProfileByUsername,
  getMySharedProfile,
} from "../services/shareprofile";
import { calculateMatch } from "../utils/matchCalculator";

export default function PublicProfile() {
  const { shareId, username } = useParams();
  const navigate = useNavigate();
  const [profileA, setProfileA] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const isLoggedIn = !!localStorage.getItem("spotify_access_token");

  useEffect(() => {
    async function load() {
      try {
        const a = shareId
          ? await getSharedProfileByShareId(shareId)
          : await getSharedProfileByUsername(username);

        if (!a) return setNotFound(true);
        setProfileA(a);

        if (!isLoggedIn) {
          localStorage.setItem("spotify_return_to", window.location.pathname);
          navigate("/");
          return;
        }

        const me = await getMySharedProfile();
        setMyProfile(me);

        if (me && me.spotify_user_id !== a.spotify_user_id) {
          setMatch(calculateMatch(a, me));
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [shareId, username, navigate, isLoggedIn]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090D] text-white">
        <p className="text-white/50">Carregando perfil...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090D] text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Perfil não encontrado</h1>
          <Link to="/" className="mt-4 block text-green-400 hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-white">
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Header do perfil */}
        <div className="mb-10 flex items-center gap-5">
          {profileA.image && (
            <img
              src={profileA.image}
              alt={profileA.display_name}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-white/10"
            />
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Perfil público
            </p>
            <h1 className="text-3xl font-bold">{profileA.display_name}</h1>
            {profileA.country && (
              <p className="text-sm text-white/50">{profileA.country}</p>
            )}
          </div>
        </div>

        {/* Match */}
        {myProfile && !match && (
          <div className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-white/60">
              Você está vendo seu próprio perfil 👀
            </p>
          </div>
        )}

        {!myProfile && (
          <div className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-white/60">
              Acesse seu dashboard primeiro para gerar seu perfil.
            </p>
            <Link
              to="/dashboard"
              className="mt-3 inline-block text-green-400 hover:underline"
            >
              Ir para o dashboard
            </Link>
          </div>
        )}

        {match && (
          <div className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-br from-[#5227FF]/20 via-[#FF9FFC]/10 to-[#7cff67]/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Compatibilidade
            </p>
            <div className="mt-3 flex items-end gap-4">
              <span className="text-6xl font-bold text-white">
                {match.score}%
              </span>
              <span className="mb-2 text-lg text-white/70">{match.label}</span>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-green-400 transition-all"
                style={{ width: `${match.score}%` }}
              />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-2xl font-bold text-green-400">
                  {match.commonArtists.length}
                </p>
                <p className="mt-1 text-xs text-white/50">Artistas em comum</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-2xl font-bold text-green-400">
                  {match.commonTracks.length}
                </p>
                <p className="mt-1 text-xs text-white/50">Músicas em comum</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-2xl font-bold text-green-400">
                  {match.commonGenres.length}
                </p>
                <p className="mt-1 text-xs text-white/50">Gêneros em comum</p>
              </div>
            </div>

            {match.commonArtists.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">
                  Artistas que vocês dois curtem
                </p>
                <div className="flex flex-wrap gap-3">
                  {match.commonArtists.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5"
                    >
                      {a.images?.[0]?.url && (
                        <img
                          src={a.images[0].url}
                          alt={a.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm text-white/80">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {match.commonGenres.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">
                  Gêneros em comum
                </p>
                <div className="flex flex-wrap gap-2">
                  {match.commonGenres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top artistas de A */}
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">
            Top artistas de {profileA.display_name}
          </p>
          <div className="space-y-3">
            {profileA.topArtists?.slice(0, 5).map((artist, i) => (
              <div key={artist.id} className="flex items-center gap-3">
                <span className="w-5 text-sm text-white/30">{i + 1}</span>
                {artist.images?.[0]?.url && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <span className="text-sm font-medium text-white">
                  {artist.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
