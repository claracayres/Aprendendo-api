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
      throw new Error("Sessão expirada. Faça login novamente.");
    }
  }

  if (response.status === 429 && retryCount < 5) {
    const retryAfter = response.headers.get("Retry-After");

    const waitSeconds = retryAfter
      ? Number(retryAfter)
      : Math.min(2 ** retryCount * 3, 30);

    console.warn(
      `Rate limit do Spotify. Tentando de novo em ${waitSeconds}s...`,
    );

    await delay(waitSeconds * 1000);

    const newToken = await getValidAccessToken();
    return spotifyFetch(url, newToken, retryCount + 1);
  }

  return response;
}

async function parseResponseBody(response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { rawText: text };
  }
}

function getResponseErrorMessage(response, data, fallbackMessage) {
  if (
    response.status === 403 &&
    data?.error?.message === "Insufficient client scope"
  ) {
    return "Seu login do Spotify não tem todas as permissões necessárias. Saia da conta e entre novamente.";
  }

  if (response.status === 429) {
    return "O Spotify limitou as requisições por excesso de acessos. Aguarde alguns minutos e tente novamente.";
  }

  if (data?.error?.message) {
    return `${fallbackMessage} (status ${response.status}): ${data.error.message}`;
  }

  if (data?.error_description) {
    return `${fallbackMessage} (status ${response.status}): ${data.error_description}`;
  }

  if (data?.rawText) {
    return `${fallbackMessage} (status ${response.status}): ${data.rawText.slice(
      0,
      120,
    )}`;
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
    "Erro ao buscar perfil do usuário",
  );
}

export async function fetchRecentlyPlayed() {
  return fetchSpotifyResource(
    "https://api.spotify.com/v1/me/player/recently-played?limit=15",
    "Erro ao buscar músicas recentes",
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
    "https://api.spotify.com/v1/me/top/tracks?limit=15&time_range=medium_term",
    "Erro ao buscar top músicas",
  );
}

export async function fetchTopArtists() {
  const data = await fetchSpotifyResource(
    "https://api.spotify.com/v1/me/top/artists?limit=15&time_range=medium_term",
    "Erro ao buscar top artistas",
  );

  return {
    items: Array.isArray(data?.items) ? data.items : [],
  };
}
