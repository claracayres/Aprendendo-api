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
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    async function loadSpotifyData() {
      try {
        const results = await Promise.allSettled([
          fetchSpotifyProfile(),
          fetchRecentlyPlayed(),
          fetchMyPlaylists(),
          fetchTopArtists(),
          fetchTopTracks(),
        ]);

        const [userResult, recentResult, playlistsResult, topArtistsResult, topTracksResult] =
          results;

        const nextWarnings = [];

        if (userResult.status === "fulfilled") {
          setUser(userResult.value);
        } else {
          throw userResult.reason;
        }

        if (recentResult.status === "fulfilled") {
          setRecentTracks(recentResult.value?.items || []);
        } else {
          console.error("ERRO NAS MUSICAS RECENTES:", recentResult.reason);
          nextWarnings.push(recentResult.reason?.message || "Nao foi possivel carregar musicas recentes.");
        }

        if (playlistsResult.status === "fulfilled") {
          setPlaylists(playlistsResult.value?.items || []);
        } else {
          console.error("ERRO NAS PLAYLISTS:", playlistsResult.reason);
          nextWarnings.push(playlistsResult.reason?.message || "Nao foi possivel carregar playlists.");
        }

        if (topArtistsResult.status === "fulfilled") {
          setTopArtists(topArtistsResult.value?.items || []);
        } else {
          console.error("ERRO NOS TOP ARTISTAS:", topArtistsResult.reason);
          nextWarnings.push(topArtistsResult.reason?.message || "Nao foi possivel carregar top artistas.");
        }

        if (topTracksResult.status === "fulfilled") {
          setTopTracks(topTracksResult.value?.items || []);
        } else {
          console.error("ERRO NAS TOP MUSICAS:", topTracksResult.reason);
          nextWarnings.push(topTracksResult.reason?.message || "Nao foi possivel carregar top musicas.");
        }

        setWarnings(nextWarnings);
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
    return <p style={{ padding: "40px" }}>Carregando dados...</p>;
  }

  if (error) {
    return <p style={{ padding: "40px", color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <div style={{ padding: "0 40px 40px" }}>
        <h1>Dashboard</h1>

        {warnings.length > 0 && (
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "#fff7e6",
              border: "1px solid #f5c26b",
              color: "#7a4b00",
            }}
          >
            <strong>Alguns dados nao puderam ser carregados:</strong>
            <ul style={{ margin: "10px 0 0", paddingLeft: "18px" }}>
              {warnings.map((warning, index) => (
                <li key={`${warning}-${index}`}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <ProfileCard user={user} />
        <TopArtistsList topArtists={topArtists} />
        <TopTracksList topTracks={topTracks} />
        <RecentTracksList recentTracks={recentTracks} />
        <PlaylistsList playlists={playlists} />
      </div>
    </div>
  );
}
