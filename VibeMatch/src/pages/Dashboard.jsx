import { useEffect, useMemo, useState } from "react";
import {
  fetchSpotifyProfile,
  fetchRecentlyPlayed,
  fetchMyPlaylists,
  fetchTopArtists,
  fetchTopTracks,
} from "../services/spotify";
import { createOrGetShareProfile } from "../services/shareprofile";

import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import TopArtistsList from "../components/TopArtistsList";
import TopTracksList from "../components/TopTracksList";
import RecentTracksList from "../components/RecentTracksList";
import PlaylistsList from "../components/PlaylistsList";
import ProfileQrCode from "../components/ProfileQrCode";

function createUsername(name = "") {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingQR, setLoadingQR] = useState(true);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  const username = createUsername(user?.display_name || "spotifyuser");

  useEffect(() => {
    let isMounted = true;

    async function loadSpotifyData() {
      try {
        const [
          userData,
          recentData,
          playlistsData,
          topArtistsData,
          topTracksData,
        ] = await Promise.all([
          fetchSpotifyProfile(),
          fetchRecentlyPlayed(),
          fetchMyPlaylists(),
          fetchTopArtists(),
          fetchTopTracks(),
        ]);

        if (!isMounted) return;

        setUser(userData);
        setRecentTracks(recentData?.items || []);
        setPlaylists(playlistsData?.items || []);
        setTopArtists(topArtistsData?.items || []);
        setTopTracks(topTracksData?.items || []);
      } catch (err) {
        if (!isMounted) return;
        console.error("ERRO NO DASHBOARD:", err);
        setError(err.message || "Erro ao carregar dados do Spotify");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSpotifyData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    async function loadFixedQR() {
      try {
        setLoadingQR(true);

        const profileData = {
          spotify_user_id: user.id,
          username,
          display_name: user?.display_name || "",
          country: user?.country || "",
          product: user?.product || "",
          email: user?.email || "",
          image: user?.images?.[0]?.url || "",
          topArtists: topArtists.slice(0, 5),
          topTracks: topTracks.slice(0, 5),
          recentTracks: recentTracks.slice(0, 5).map((item) => item.track),
          playlists: playlists.slice(0, 5),
        };

        await createOrGetShareProfile(user.id, profileData);

        if (!isMounted) return;

        setShareUrl(`${window.location.origin}/${username}`);
      } catch (err) {
        console.error("Erro ao carregar QR fixo:", err);
      } finally {
        if (isMounted) setLoadingQR(false);
      }
    }

    loadFixedQR();

    return () => {
      isMounted = false;
    };
  }, [user, username, topArtists, topTracks, recentTracks, playlists]);

  const stats = useMemo(
    () => [
      {
        title: "Top artistas",
        value: topArtists.length,
        subtitle: "artistas",
        glow: "from-green-500/20 to-emerald-500/5",
      },
      {
        title: "Top músicas",
        value: topTracks.length,
        subtitle: "músicas",
        glow: "from-violet-500/20 to-fuchsia-500/5",
      },
      {
        title: "Recentes",
        value: recentTracks.length,
        subtitle: "ouvidas recentemente",
        glow: "from-amber-500/20 to-orange-500/5",
      },
      {
        title: "Playlists",
        value: playlists.length,
        subtitle: "playlists criadas",
        glow: "from-pink-500/20 to-rose-500/5",
      },
    ],
    [playlists.length, recentTracks.length, topArtists.length, topTracks.length],
  );

  async function handleCopyLink() {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copiado!");
    } catch (err) {
      console.error("Erro ao copiar link:", err);
      alert("Não foi possível copiar o link.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10">
          <p className="text-sm text-white/45">Carregando sua vibe...</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Dashboard</h1>

          <div className="mt-8 animate-pulse space-y-5">
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="h-[270px] rounded-[30px] border border-white/10 bg-white/5" />
              <div className="h-[270px] rounded-[30px] border border-white/10 bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-10 md:px-10">
          <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-red-200/70">
              Algo deu errado
            </p>
            <h1 className="mt-2 text-2xl font-bold">
              Não foi possível carregar o dashboard
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090D] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-120px] top-[30px] h-[340px] w-[340px] rounded-full bg-green-500/10 blur-[120px]" />
        <div className="absolute right-[-100px] top-[220px] h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10">
        <section className="mb-8">
          <p className="text-sm text-white/45">
            Aqui está o seu universo musical
          </p>

          <div className="mt-2 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Olá, {user?.display_name || "Spotify User"}! 👋
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
                Veja seu perfil, artistas favoritos, músicas mais ouvidas,
                playlists e atividade recente em um só lugar.
              </p>
            </div>

            <div className="rounded-2xl border border-green-500/20 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                Link público
              </p>
              <p className="mt-1 text-sm font-medium text-green-300">
                /{username}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-5 grid items-stretch gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl">
            <div className="h-full rounded-[28px] bg-gradient-to-br from-green-500/10 via-transparent to-transparent">
              <ProfileCard user={user} />
            </div>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-[#11131a] via-[#0d0f15] to-[#11131a] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="flex h-full w-full flex-col items-center justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.22em] text-green-300/70">
                  Seu perfil público
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                  Compartilhe sua vibe musical
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/65 md:text-base">
                  Use seu link ou QR code para outras pessoas abrirem seu perfil
                  musical público.
                </p>
              </div>

              <div className="w-full max-w-md">
                <div className="flex w-full flex-col items-center gap-5">
                  {loadingQR ? (
                    <div className="flex h-[130px] w-full items-center justify-center rounded-[32px] border border-dashed border-green-400/25 bg-white/[0.03] text-center text-sm text-white/35">
                      Carregando QR...
                    </div>
                  ) : (
                    <ProfileQrCode shareUrl={shareUrl} username={username} />
                  )}

                  <div className="flex w-full flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleCopyLink}
                      disabled={!shareUrl}
                      className="w-full rounded-2xl bg-green-500 px-5 py-3 font-semibold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Copiar link
                    </button>

                    <button
                      disabled
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white/50"
                    >
                      Match em breve
                    </button>
                  </div>

                  <div className="w-full rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm leading-6 text-white/60">
                      Seu link público:{" "}
                      <span className="text-green-300">{shareUrl}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${item.glow} p-5 backdrop-blur-xl`}
            >
              <p className="text-sm text-white/55">{item.title}</p>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-white/55">{item.subtitle}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <TopArtistsList topArtists={topArtists} />
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <TopTracksList topTracks={topTracks} />
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <RecentTracksList recentTracks={recentTracks} />
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <PlaylistsList playlists={playlists} />
          </div>
        </section>
      </main>
    </div>
  );
}