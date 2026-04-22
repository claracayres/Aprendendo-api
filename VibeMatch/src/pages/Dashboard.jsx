import { useEffect, useState } from "react";
import {
  fetchSpotifyProfile,
  fetchRecentlyPlayed,
  fetchMyPlaylists,
  fetchTopArtists,
  fetchTopTracks,
} from "../services/spotify";

import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import TopArtistsList from "../components/TopArtistsList";
import TopTracksList from "../components/TopTracksList";
import RecentTracksList from "../components/RecentTracksList";
import PlaylistsList from "../components/PlaylistsList";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

        setUser(userData);
        setRecentTracks(recentData.items || []);
        setPlaylists(playlistsData.items || []);
        setTopArtists(topArtistsData.items || []);
        setTopTracks(topTracksData.items || []);
      } catch (err) {
        console.error("ERRO NO DASHBOARD:", err);
        setError(err.message || "Erro ao carregar dados do Spotify");
      } finally {
        setLoading(false);
      }
    }

    loadSpotifyData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B12] text-white">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10">
          <div className="mb-8">
            <p className="text-sm text-white/45">Carregando sua vibe...</p>
            <h1 className="text-3xl font-bold md:text-4xl">Dashboard</h1>
          </div>

          <div className="animate-pulse space-y-5">
            <div className="h-44 rounded-[28px] border border-white/10 bg-white/5" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="h-32 rounded-3xl border border-white/10 bg-white/5" />
              <div className="h-32 rounded-3xl border border-white/10 bg-white/5" />
              <div className="h-32 rounded-3xl border border-white/10 bg-white/5" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="h-32 rounded-3xl border border-white/10 bg-white/5" />
              <div className="h-32 rounded-3xl border border-white/10 bg-white/5" />
              <div className="h-32 rounded-3xl border border-white/10 bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0B12] text-white">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-10 md:px-10">
          <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-red-200/70">
              Algo deu errado
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">
              Não foi possível carregar o dashboard
            </h1>
            <p className="mt-3 text-sm text-white/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0B12] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-120px] top-[40px] h-[320px] w-[320px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-[-100px] top-[220px] h-[320px] w-[320px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute bottom-[-100px] left-[20%] h-[260px] w-[260px] rounded-full bg-accent-green/10 blur-[120px]" />
      </div>

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10">
        <section className="mb-8">
          <p className="text-sm text-white/45">Sua identidade musical</p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
                Veja seu perfil, artistas favoritos, músicas mais ouvidas,
                playlists e atividade recente em um só lugar.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                Conta conectada
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {user?.display_name || "Spotify User"}
              </p>
            </div>
          </div>
        </section>

        <ProfileCard user={user} />

        <TopArtistsList topArtists={topArtists} />
        <TopTracksList topTracks={topTracks} />
        <RecentTracksList recentTracks={recentTracks} />
        <PlaylistsList playlists={playlists} />
      </main>
    </div>
  );
}
