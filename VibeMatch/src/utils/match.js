function normalizeArray(arr) {
  return [...new Set((arr || []).map((item) => item?.toLowerCase().trim()))];
}

function intersectionPercentage(listA, listB) {
  const a = normalizeArray(listA);
  const b = normalizeArray(listB);

  if (!a.length || !b.length) return 0;

  const setB = new Set(b);
  const common = a.filter((item) => setB.has(item));

  return common.length / Math.max(a.length, b.length);
}

export function calculateMatchScore(userA, userB) {
  const artistsA = userA.topArtists?.map((artist) => artist.name) || [];
  const artistsB = userB.topArtists?.map((artist) => artist.name) || [];

  const tracksA = userA.topTracks?.map((track) => track.name) || [];
  const tracksB = userB.topTracks?.map((track) => track.name) || [];

  const genresA = userA.topArtists?.flatMap((artist) => artist.genres || []) || [];
  const genresB = userB.topArtists?.flatMap((artist) => artist.genres || []) || [];

  const artistScore = intersectionPercentage(artistsA, artistsB);
  const trackScore = intersectionPercentage(tracksA, tracksB);
  const genreScore = intersectionPercentage(genresA, genresB);

  const finalScore =
    artistScore * 0.5 +
    genreScore * 0.3 +
    trackScore * 0.2;

  return {
    percentage: Math.round(finalScore * 100),
    details: {
      artistScore: Math.round(artistScore * 100),
      genreScore: Math.round(genreScore * 100),
      trackScore: Math.round(trackScore * 100),
      commonArtists: artistsA.filter((name) =>
        artistsB.map((x) => x.toLowerCase()).includes(name.toLowerCase())
      ),
      commonTracks: tracksA.filter((name) =>
        tracksB.map((x) => x.toLowerCase()).includes(name.toLowerCase())
      ),
      commonGenres: [...new Set(
        genresA.filter((genre) =>
          genresB.map((x) => x.toLowerCase()).includes(genre.toLowerCase())
        )
      )],
    },
  };
}