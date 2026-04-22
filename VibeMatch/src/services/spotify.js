import { getValidAccessToken, refreshAccessToken } from "./auth";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function spotifyFetch(url, token, retryCount = 0) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 && retryCount < 1) {
    try {
      await refreshAccessToken();
      const newToken = await getValidAccessToken();
      return spotifyFetch(url, newToken, retryCount + 1);
    } catch {
      throw new Error("Sessao expirada. Faca login novamente.");
    }
  }

  if (response.status === 429 && retryCount < 2) {
    const retryAfter = response.headers.get("Retry-After");
    const waitSeconds = retryAfter ? Number(retryAfter) : 2;

    await delay(waitSeconds * 1000);

    const newToken = await getValidAccessToken();
    return spotifyFetch(url, newToken, retryCount + 1);
  }

  return response;
}

async function parseResponseBody(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      rawText: text,
    };
  }
}

function getResponseErrorMessage(response, data, fallbackMessage) {
  if (response.status === 403 && data?.error?.message === "Insufficient client scope") {
    return "Seu login do Spotify nao tem todas as permissoes necessarias. Saia da conta e entre novamente.";
  }

  if (data?.error?.message) {
    return `${fallbackMessage} (status ${response.status}): ${data.error.message}`;
  }

  if (data?.error_description) {
    return `${fallbackMessage} (status ${response.status}): ${data.error_description}`;
  }

  if (data?.rawText) {
    return `${fallbackMessage} (status ${response.status}): ${data.rawText.slice(0, 120)}`;
  }

  return `${fallbackMessage} (status ${response.status})`;
}

async function fetchSpotifyResource(url, fallbackMessage) {
  const token = await getValidAccessToken();
  const response = await spotifyFetch(url, token);
  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(getResponseErrorMessage(response, data, fallbackMessage));
  }

  return data;
}

export async function fetchSpotifyProfile() {
  return fetchSpotifyResource(
    "https://api.spotify.com/v1/me",
    "Erro ao buscar perfil do usuario",
  );
}

export async function fetchRecentlyPlayed() {
  return fetchSpotifyResource(
    "https://api.spotify.com/v1/me/player/recently-played?limit=10",
    "Erro ao buscar musicas recentes",
  );
}

export async function fetchMyPlaylists() {
  return fetchSpotifyResource(
    "https://api.spotify.com/v1/me/playlists?limit=5",
    "Erro ao buscar playlists",
  );
}

export async function fetchTopTracks() {
  return fetchSpotifyResource(
    "https://api.spotify.com/v1/me/top/tracks?limit=6&time_range=medium_term",
    "Erro ao buscar top musicas",
  );
}

async function getArtistDetails(artistId, token) {
  const response = await spotifyFetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    token,
  );
  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(
      getResponseErrorMessage(
        response,
        data,
        `Erro ao buscar detalhes do artista ${artistId}`,
      ),
    );
  }

  return data;
}

export async function fetchTopArtists() {
  const token = await getValidAccessToken();
  const response = await spotifyFetch(
    "https://api.spotify.com/v1/me/top/artists?limit=6&time_range=medium_term",
    token,
  );
  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(
      getResponseErrorMessage(response, data, "Erro ao buscar top artistas"),
    );
  }

  if (!data?.items?.length) {
    return { items: [] };
  }

  const artistsWithGenres = [];

  for (const artist of data.items) {
    try {
      const details = await getArtistDetails(artist.id, token);

      artistsWithGenres.push({
        ...artist,
        genres: Array.isArray(details?.genres) ? details.genres : [],
      });
    } catch (error) {
      console.warn(`Nao foi possivel buscar generos de ${artist.name}:`, error.message);

      artistsWithGenres.push({
        ...artist,
        genres: Array.isArray(artist?.genres) ? artist.genres : [],
      });
    }

    await delay(150);
  }

  return {
    items: artistsWithGenres,
  };
}
