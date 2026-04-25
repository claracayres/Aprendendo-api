export function calculateMatch(profileA = {}, profileB = {}) {
  const topArtistsA = profileA.topArtists || [];
  const topArtistsB = profileB.topArtists || [];
  const topTracksA = profileA.topTracks || [];
  const topTracksB = profileB.topTracks || [];
  const recentTracksA = profileA.recentTracks || [];
  const recentTracksB = profileB.recentTracks || [];

  const getTrackId = (item) => item?.id || item?.track?.id;

  const artistIdsA = new Set(topArtistsA.map((a) => a.id));
  const commonArtists = topArtistsB.filter((a) => artistIdsA.has(a.id));

  const trackIdsA = new Set(topTracksA.map(getTrackId).filter(Boolean));
  const commonTracks = topTracksB.filter((t) => trackIdsA.has(getTrackId(t)));

  const recentTrackIdsA = new Set(
    recentTracksA.map(getTrackId).filter(Boolean)
  );

  const commonRecentTracks = recentTracksB.filter((t) =>
    recentTrackIdsA.has(getTrackId(t))
  );

  const genresA = new Set(
    topArtistsA.flatMap((a) => a.genres || []).map((g) => g.toLowerCase())
  );

  const allGenresB = topArtistsB
    .flatMap((a) => a.genres || [])
    .map((g) => g.toLowerCase());

  const commonGenres = [...new Set(allGenresB.filter((g) => genresA.has(g)))];

  const artistScore = Math.min(commonArtists.length / 20, 1) * 35;
  const trackScore = Math.min(commonTracks.length / 20, 1) * 30;
  const recentScore = Math.min(commonRecentTracks.length / 20, 1) * 20;
  const genreScore = Math.min(commonGenres.length / 20, 1) * 15;

  const score = Math.round(artistScore + trackScore + recentScore + genreScore);

  const label =
    score >= 80
      ? "Almas gêmeas musicais 🔥"
      : score >= 60
        ? "Vibe muito parecida 🎯"
        : score >= 40
          ? "Gostos em comum 🎵"
          : score >= 20
            ? "Mundos diferentes, mas ok 🌍"
            : "Opostos musicais 😅";

  return {
    commonArtists,
    commonTracks,
    commonRecentTracks,
    commonGenres,
    score,
    label,
  };
}