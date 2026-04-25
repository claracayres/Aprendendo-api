import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import { Link, useNavigate } from "react-router-dom";
import {
  getSharedProfileByUsername,
  getSharedProfileByShareId,
  getMySharedProfile,
} from "../services/shareprofile";
import { calculateMatch } from "../utils/matchCalculator";
import Navbar from "../components/Navbar";

function extractProfileIdentifier(value) {
  if (!value) return null;

  const text = value.trim();

  try {
    const url = new URL(text);
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts[0] === "u" && parts[1])
      return { type: "shareId", value: parts[1] };
    if (parts[0]) return { type: "username", value: parts[0] };
  } catch {
    return { type: "username", value: text.replace("@", "") };
  }

  return null;
}
function getTasteDescription(profile) {
  const artists = profile?.topArtists || [];

  const genres = artists
    .flatMap((artist) => artist.genres || [])
    .map((genre) => genre.toLowerCase());

  if (genres.length === 0) return "misterioso e sem gênero definido";

  const tasteMap = [
    {
      label: "k-pop e cultura coreana",
      keywords: ["k-pop", "kpop", "korean pop"],
    },
    {
      label: "sertanejo e brasilidades",
      keywords: ["sertanejo", "pagode", "funk", "mpb", "forro", "brazilian"],
    },
    {
      label: "rap, trap e hip-hop",
      keywords: ["rap", "trap", "hip hop", "r&b"],
    },
    {
      label: "rock e alternativo",
      keywords: ["rock", "alternative", "punk", "metal", "grunge"],
    },
    {
      label: "indie e vibes chill",
      keywords: [
        "indie",
        "chill",
        "lo-fi",
        "acoustic",
        "bedroom",
        "folk",
        "psychedelic rock",
        "indie rock",
        "soundtrack",
      ],
    },
    {
      label: "eletrônico e dançante",
      keywords: ["edm", "house", "electronic", "techno", "dance"],
    },
    {
      label: "pop e mainstream",
      keywords: ["pop", "dance pop", "latin pop"],
    },
  ];

  const scores = tasteMap.map((taste) => {
    const score = genres.reduce((total, genre) => {
      const matched = taste.keywords.some((keyword) => genre.includes(keyword));
      return matched ? total + 1 : total;
    }, 0);

    return { ...taste, score };
  });

  // 🔥 prioridade pra kpop
  const kpop = scores.find((t) => t.label.includes("k-pop"));
  if (kpop && kpop.score > 0) {
    return kpop.label;
  }

  const sorted = scores.sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const second = sorted[1];

  if (best.score === 0) return "eclético e variado";

  if (second && second.score > 0 && second.score === best.score) {
    return `${best.label}, com toque de ${second.label}`;
  }

  return best.label;
}
export default function Match() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [profileA, setProfileA] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const isLoggedIn = !!localStorage.getItem("spotify_access_token");

  async function calculateByValue(value) {
    setError("");
    setMatch(null);
    setProfileA(null);
    setInputValue(value);

    if (!isLoggedIn) {
      localStorage.setItem("spotify_return_to", "/match");
      navigate("/");
      return;
    }

    const identifier = extractProfileIdentifier(value);

    if (!identifier?.value) {
      setError("QR Code inválido. Ele precisa ter um link de perfil.");
      return;
    }

    try {
      setLoading(true);

      const targetProfile =
        identifier.type === "shareId"
          ? await getSharedProfileByShareId(identifier.value)
          : await getSharedProfileByUsername(identifier.value);

      if (!targetProfile) {
        setError("Perfil não encontrado.");
        return;
      }

      const me = await getMySharedProfile();

      if (!me) {
        setError("Entre no dashboard primeiro para gerar seu perfil musical.");
        return;
      }

      if (me.spotify_user_id === targetProfile.spotify_user_id) {
        setError("Esse é o seu próprio perfil. Escaneie o QR de outra pessoa.");
        return;
      }

      setProfileA(targetProfile);
      setMyProfile(me);
      setMatch(calculateMatch(targetProfile, me));
    } catch (err) {
      console.error(err);
      setError("Não foi possível calcular o match agora.");
    } finally {
      setLoading(false);
    }
  }
  async function handleSearch(e) {
    e.preventDefault();
    await calculateByValue(inputValue);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090D] text-white">
      <AnimatedBackground />

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10">
        <motion.section
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mb-8"
        >
          <p className="text-sm text-white/45">Compare sua vibe com alguém</p>

          <div className="mt-2 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Match musical
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
                Cole um link público, digite um username ou escaneie o QR Code
                para descobrir a compatibilidade musical.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              ← Dashboard
            </Link>
          </div>
        </motion.section>

        <section className="mb-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative overflow-hidden rounded-[34px] border border-white/10 bg-linear-to-br from-[#11131a] via-[#0d0f15] to-[#11131a] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-green-500/10 blur-3xl" />

            <p className="text-xs uppercase tracking-[0.22em] text-green-300/70">
              Encontrar perfil
            </p>

            <h2 className="mt-3 text-2xl font-bold text-white">
              Quem vai bater a vibe com você?
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/60">
              Use o link do QR Code, o username público ou escaneie direto pela
              câmera.
            </p>

            <form onSubmit={handleSearch} className="mt-6 space-y-4">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="https://vibematchs.vercel.app/clara ou clara"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-green-400/70 focus:ring-4 focus:ring-green-400/10"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-green-500 px-5 py-4 font-bold text-black shadow-[0_0_35px_rgba(34,197,94,0.22)] transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Calculando..." : "Calcular match"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => {
                    setError("");
                    setShowScanner((prev) => !prev);
                  }}
                  className="rounded-2xl border border-green-400/25 bg-green-500/10 px-5 py-4 text-sm font-bold text-green-300 shadow-[0_0_28px_rgba(34,197,94,0.08)] transition hover:bg-green-500/20 hover:text-green-200"
                >
                  {showScanner ? "Fechar scanner" : "Escanear QR"}
                </motion.button>
              </div>
            </form>
            {showScanner && (
              <QrScanner
                onScan={(text) => {
                  setShowScanner(false);
                  calculateByValue(text);
                }}
              />
            )}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-[34px] border border-white/10 bg-white/4 p-1 backdrop-blur-xl"
          >
            <div className="h-full overflow-hidden rounded-[32px] bg-linear-to-br from-green-500/10 via-transparent to-purple-500/10 p-6">
              <AnimatePresence mode="wait">
                {!match ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="flex h-full min-h-[310px] flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                        Como usar
                      </p>

                      <h2 className="mt-3 text-3xl font-bold">
                        Três jeitos de comparar
                      </h2>

                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                        Essa página funciona como uma central de match. A pessoa
                        compartilha o perfil e você descobre a compatibilidade.
                      </p>
                    </div>

                    <div className="mt-8 grid gap-3 md:grid-cols-2">
                      <InfoCard
                        icon="🔗"
                        title="Link"
                        text="Cole o link público ou username."
                      />
                      <InfoCard
                        icon="📱"
                        title="QR Code"
                        text="Escaneie o QR e calcule o match."
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MatchHero
                      match={match}
                      profileA={profileA}
                      myProfile={myProfile}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        <AnimatePresence>
          {match && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.55 }}
            >
              <section className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard value={match.commonArtists.length} label="Artistas" />
                <StatCard value={match.commonTracks.length} label="Músicas" />
                <StatCard value={match.commonGenres.length} label="Gêneros" />
                <StatCard
                  value={match.commonRecentTracks?.length || 0}
                  label="Recentes"
                />
              </section>

              <section className="mb-5 grid gap-5 xl:grid-cols-2">
                <TasteCard
                  title={`O gosto de ${profileA?.display_name || "usuário"} é mais`}
                  taste={getTasteDescription(profileA)}
                  profile={profileA}
                />

                <TasteCard
                  title="O seu gosto é mais"
                  taste={getTasteDescription(myProfile)}
                  profile={myProfile}
                />
              </section>

              <section className="grid gap-5 xl:grid-cols-2">
                <ResultList
                  title="Artistas em comum"
                  empty="Nenhum artista em comum ainda."
                  items={match.commonArtists}
                  type="artist"
                />

                <ResultList
                  title="Músicas em comum"
                  empty="Nenhuma música em comum ainda."
                  items={match.commonTracks}
                  type="track"
                />

                <ResultList
                  title="Ouvidas recentemente em comum"
                  empty="Nenhuma música recente em comum ainda."
                  items={match.commonRecentTracks || []}
                  type="track"
                />

                <GenresCard genres={match.commonGenres} />

                <UserMusicList
                  title={`Top artistas de ${profileA?.display_name || "usuário"}`}
                  items={profileA?.topArtists || []}
                  type="artist"
                />

                <UserMusicList
                  title={`Recém ouvidas de ${profileA?.display_name || "usuário"}`}
                  items={profileA?.recentTracks || []}
                  type="track"
                />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AnimatedBackground() {
  const notes = ["♪", "♫", "♬", "♩", "♭", "♯"];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{
          x: [0, 90, -40, 0],
          y: [0, -70, 70, 0],
          scale: [1, 1.18, 0.96, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-28 top-12 h-96 w-96 rounded-full bg-green-500/20 blur-[140px]"
      />

      <motion.div
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 70, -45, 0],
          scale: [1, 0.92, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-72 h-[440px] w-[440px] rounded-full bg-purple-500/20 blur-[155px]"
      />

      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/3 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-pink-500/10 blur-[175px]"
      />

      <motion.div
        animate={{ backgroundPosition: ["0px 0px", "80px 80px"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-60 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#07090D_82%)]" />

      {notes.map((note, index) => (
        <motion.span
          key={`${note}-${index}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: [0, 0.45, 0],
            y: [-20, -220],
            x: [0, index % 2 === 0 ? 45 : -45],
            rotate: [0, index % 2 === 0 ? 18 : -18],
          }}
          transition={{
            duration: 8 + index,
            repeat: Infinity,
            delay: index * 1.3,
            ease: "easeInOut",
          }}
          className="absolute text-4xl font-black text-green-300/20"
          style={{
            left: `${12 + index * 14}%`,
            top: `${72 + (index % 3) * 8}%`,
          }}
        >
          {note}
        </motion.span>
      ))}

      <motion.div
        animate={{
          scaleX: [0.6, 1, 0.65, 1],
          opacity: [0.2, 0.55, 0.25, 0.45],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 h-32 w-[80vw] -translate-x-1/2 rounded-t-full bg-green-500/10 blur-3xl"
      />
    </div>
  );
}

function MatchHero({ match, profileA, myProfile }) {
  return (
    <div className="flex h-full min-h-[310px] flex-col justify-center">
      <p className="text-xs uppercase tracking-[0.22em] text-green-300/70">
        Resultado do match
      </p>

      <div className="mt-6 flex flex-col items-center justify-center gap-8 md:flex-row">
        <ProfileBubble profile={profileA} subtitle="Perfil comparado" />

        <div className="text-center">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
            className="relative mx-auto flex h-36 w-36 items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,transparent,rgba(34,197,94,0.6),transparent,rgba(168,85,247,0.45),transparent)] blur-sm"
            />

            <div className="absolute inset-2 rounded-full bg-[#07090D]" />

            <span className="relative text-4xl font-black">{match.score}%</span>
          </motion.div>

          <p className="mt-3 text-lg font-bold">{match.label}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">
            compatibilidade
          </p>
        </div>

        <ProfileBubble profile={myProfile} subtitle="Você" />
      </div>
    </div>
  );
}

function ProfileBubble({ profile, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      className="flex flex-col items-center text-center"
    >
      {profile?.image ? (
        <img
          src={profile.image}
          alt={profile.display_name}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-white/10"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-purple-500 text-3xl font-black">
          {profile?.display_name?.[0]?.toUpperCase() || "?"}
        </div>
      )}

      <p className="mt-3 max-w-[150px] truncate text-base font-bold">
        {profile?.display_name || "Perfil"}
      </p>

      <p className="text-xs text-white/40">{subtitle}</p>
    </motion.div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:bg-white/7"
    >
      <p className="text-3xl">{icon}</p>
      <h3 className="mt-4 font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/50">{text}</p>
    </motion.div>
  );
}

function StatCard({ value, label }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-[24px] border border-white/10 bg-linear-to-br from-green-500/10 via-white/[0.03] to-transparent p-5 backdrop-blur-xl"
    >
      <p className="text-sm text-white/55">{label} em comum</p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-green-400">
        {value}
      </p>
    </motion.div>
  );
}

function ResultList({ title, items, empty, type }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/4 p-6 backdrop-blur-xl">
      <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/40">
        {title}
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/45">
          {empty}
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 20).map((item, index) => {
            const image =
              type === "artist"
                ? item.images?.[0]?.url
                : item.album?.images?.[0]?.url;

            const subtitle =
              type === "track"
                ? item.artists?.map((artist) => artist.name).join(", ")
                : item.genres?.slice(0, 20).join(", ");

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group flex items-center gap-4 rounded-2xl border border-white/0 bg-black/20 p-3 transition hover:border-white/10 hover:bg-white/7"
              >
                <span className="w-6 text-sm text-white/25">{index + 1}</span>

                {image ? (
                  <img
                    src={image}
                    alt={item.name}
                    className={`h-12 w-12 object-cover ${
                      type === "artist" ? "rounded-full" : "rounded-xl"
                    }`}
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    ♫
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.name}
                  </p>
                  {subtitle && (
                    <p className="truncate text-xs text-white/40">{subtitle}</p>
                  )}
                </div>

                <div className="opacity-0 transition group-hover:opacity-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-sm text-black">
                    ▶
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GenresCard({ genres }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/4 p-6 backdrop-blur-xl">
      <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/40">
        Gêneros em comum
      </p>

      {genres.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/45">
          Nenhum gênero em comum encontrado.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {genres.map((genre, index) => (
            <motion.span
              key={genre}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-full border border-green-400/15 bg-green-500/10 px-4 py-2 text-xs font-medium text-green-300"
            >
              {genre}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

function TasteCard({ title, taste, profile }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-linear-to-br from-green-500/10 via-white/[0.03] to-purple-500/10 p-6 backdrop-blur-xl"
    >
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative flex items-center gap-4">
        {profile?.image ? (
          <img
            src={profile.image}
            alt={profile.display_name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-xl font-black text-black">
            {profile?.display_name?.[0]?.toUpperCase() || "?"}
          </div>
        )}

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Análise de vibe
          </p>
          <h3 className="mt-1 text-lg font-bold text-white">{title}</h3>
        </div>
      </div>

      <p className="relative mt-5 text-3xl font-black text-green-400">
        {taste}
      </p>

      <p className="relative mt-3 text-sm leading-6 text-white/55">
        Baseado nos principais artistas e gêneros salvos no perfil musical.
      </p>
    </motion.div>
  );
}

function UserMusicList({ title, items, type }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/4 p-6 backdrop-blur-xl">
      <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/40">
        {title}
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/45">
          Nada encontrado ainda.
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item, index) => {
            const image =
              type === "artist"
                ? item.images?.[0]?.url
                : item.album?.images?.[0]?.url;

            const title =
              type === "artist" ? item.name : item.name || item.track?.name;

            const subtitle =
              type === "artist"
                ? item.genres?.slice(0, 2).join(", ")
                : item.artists?.map((artist) => artist.name).join(", ");

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group flex items-center gap-4 rounded-2xl border border-white/0 bg-black/20 p-3 transition hover:border-white/10 hover:bg-white/7"
              >
                <span className="w-6 text-sm text-white/25">{index + 1}</span>

                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className={`h-12 w-12 object-cover ${
                      type === "artist" ? "rounded-full" : "rounded-xl"
                    }`}
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    ♫
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {title}
                  </p>

                  {subtitle && (
                    <p className="truncate text-xs text-white/40">{subtitle}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QrScanner({ onScan }) {
  const [scannerError, setScannerError] = useState("");

  useEffect(() => {
    let scanner;
    let isMounted = true;

    async function startScanner() {
      try {
        scanner = new Html5Qrcode("qr-reader");

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 230, height: 230 },
            aspectRatio: 1,
          },
          async (decodedText) => {
            if (!decodedText) return;

            onScan(decodedText);

            try {
              const state = scanner.getState?.();

              if (state === 2) {
                await scanner.stop();
              }

              await scanner.clear();
            } catch (err) {
              console.warn("Scanner já estava fechado:", err);
            }
          },
          () => {
            // silencioso para não ficar enchendo o console enquanto procura QR
          },
        );
      } catch (err) {
        console.error("Erro ao abrir scanner:", err);

        if (isMounted) {
          setScannerError(
            "Não consegui abrir a câmera. Permita o acesso ou teste em HTTPS/localhost.",
          );
        }
      }
    }

    startScanner();

    return () => {
      isMounted = false;

      if (scanner) {
        try {
          const state = scanner.getState?.();

          if (state === 2) {
            scanner
              .stop()
              .then(() => scanner.clear())
              .catch(() => {});
          } else {
            scanner.clear().catch(() => {});
          }
        } catch {
          // evita quebrar o React
        }
      }
    };
  }, [onScan]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      className="mt-6 overflow-hidden rounded-[30px] border border-green-400/20 bg-black/40 p-4 shadow-[0_0_45px_rgba(34,197,94,0.12)]"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-green-300/70">
            Scanner QR
          </p>
          <h3 className="mt-1 text-lg font-bold text-white">
            Aponte a câmera para o QR Code
          </h3>
          <p className="mt-1 text-xs text-white/45">
            Quando ler o QR, o link aparece no campo automaticamente.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-xl">
          📱
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#05070A] p-2">
        <div
          id="qr-reader"
          className="min-h-[290px] overflow-hidden rounded-[22px] bg-black"
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-58 w-58 rounded-[30px] border-2 border-green-400/80 shadow-[0_0_45px_rgba(34,197,94,0.35)]">
            <span className="absolute -left-1 -top-1 h-8 w-8 rounded-tl-[30px] border-l-4 border-t-4 border-green-300" />
            <span className="absolute -right-1 -top-1 h-8 w-8 rounded-tr-[30px] border-r-4 border-t-4 border-green-300" />
            <span className="absolute -bottom-1 -left-1 h-8 w-8 rounded-bl-[30px] border-b-4 border-l-4 border-green-300" />
            <span className="absolute -bottom-1 -right-1 h-8 w-8 rounded-br-[30px] border-b-4 border-r-4 border-green-300" />
          </div>
        </div>
      </div>

      {scannerError ? (
        <p className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
          {scannerError}
        </p>
      ) : (
        <p className="mt-3 text-center text-xs text-white/45">
          Dica: no celular, use o site publicado em HTTPS. No computador, use
          localhost.
        </p>
      )}
    </motion.div>
  );
}
