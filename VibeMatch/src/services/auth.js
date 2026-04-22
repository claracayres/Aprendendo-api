import { generateRandomString, generateCodeChallenge } from "../utils/pkce";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const codeVerifierStorageKey = "spotify_code_verifier";
const authStateStorageKey = "spotify_auth_state";
const accessTokenStorageKey = "spotify_access_token";
const refreshTokenStorageKey = "spotify_refresh_token";
const tokenExpiryStorageKey = "spotify_token_expiry";

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-recently-played",
  "playlist-read-private",
  "user-library-read",
  "user-top-read",
];

function clearStoredSession() {
  localStorage.removeItem(accessTokenStorageKey);
  localStorage.removeItem(refreshTokenStorageKey);
  localStorage.removeItem(tokenExpiryStorageKey);
  localStorage.removeItem("spotify_user");
}

function clearPkceStorage() {
  localStorage.removeItem(codeVerifierStorageKey);
  localStorage.removeItem(authStateStorageKey);
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

export async function loginWithSpotify() {
  clearStoredSession();

  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);

  localStorage.setItem(codeVerifierStorageKey, codeVerifier);
  localStorage.setItem(authStateStorageKey, state);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
    show_dialog: "true",
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code, state) {
  const codeVerifier = localStorage.getItem(codeVerifierStorageKey);
  const storedState = localStorage.getItem(authStateStorageKey);

  if (!codeVerifier) {
    throw new Error("Sessao de login expirada. Entre com Spotify novamente.");
  }

  if (!storedState || !state || state !== storedState) {
    clearPkceStorage();
    clearStoredSession();
    throw new Error("Nao foi possivel validar o login do Spotify. Tente novamente.");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    clearPkceStorage();
    clearStoredSession();
    throw new Error(
      data?.error_description ||
        data?.error?.message ||
        data?.rawText ||
        "Falha ao obter access token do Spotify.",
    );
  }

  clearPkceStorage();
  return data;
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(refreshTokenStorageKey);

  if (!refreshToken) {
    clearStoredSession();
    throw new Error("Refresh token nao encontrado. Faca login novamente.");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    clearStoredSession();
    throw new Error(
      data?.error_description ||
        data?.error?.message ||
        data?.rawText ||
        "Falha ao renovar token. Faca login novamente.",
    );
  }

  if (!data?.access_token) {
    clearStoredSession();
    throw new Error("Nao foi possivel renovar a sessao do Spotify.");
  }

  localStorage.setItem(accessTokenStorageKey, data.access_token);

  if (data.refresh_token) {
    localStorage.setItem(refreshTokenStorageKey, data.refresh_token);
  }

  localStorage.setItem(
    tokenExpiryStorageKey,
    String(Date.now() + data.expires_in * 1000),
  );

  return data.access_token;
}

export function getStoredAccessToken() {
  return localStorage.getItem(accessTokenStorageKey);
}

export function isTokenExpired() {
  const expiry = localStorage.getItem(tokenExpiryStorageKey);

  if (!expiry) {
    return true;
  }

  return Date.now() >= Number(expiry);
}

export function clearSpotifySession() {
  clearPkceStorage();
  clearStoredSession();
}

export async function getValidAccessToken() {
  let token = getStoredAccessToken();

  if (!token) {
    throw new Error("Sessao de login expirada. Entre com Spotify novamente.");
  }

  if (isTokenExpired()) {
    token = await refreshAccessToken();
  }

  return token;
}