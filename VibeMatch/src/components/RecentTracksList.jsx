function formatDuration(ms) {
  if (!ms) return "--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getTimeAgo(playedAt) {
  if (!playedAt) return "Agora há pouco";

  const now = new Date();
  const playedDate = new Date(playedAt);
  const diffMs = now - playedDate;

  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Agora há pouco";
  if (diffMinutes < 60) return `${diffMinutes} min atrás`;
  if (diffHours < 24) return `${diffHours} h atrás`;
  return `${diffDays} d atrás`;
}

export default function RecentTracksList({ recentTracks }) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Atividade recente
          </p>
          <h2 className="text-2xl font-bold text-white">
            Ouvidas recentemente
          </h2>
        </div>
      </div>

      {recentTracks.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-[56px_minmax(0,1fr)_auto] gap-4 border-b border-white/5 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white/35">
            <span></span>
            <span>Título</span>
            <span>Tempo</span>
          </div>

          <div className="divide-y divide-white/5">
            {recentTracks.map((item, index) => {
              const track = item.track;
              const artists =
                track?.artists?.map((artist) => artist.name).join(", ") ||
                "Artista desconhecido";

              return (
                <div
                  key={`${track?.id}-${index}`}
                  className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04]"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white/10">
                    {track?.album?.images?.[0]?.url ? (
                      <img
                        src={track.album.images[0].url}
                        alt={track?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {track?.name || "Faixa desconhecida"}
                    </p>
                    <p className="truncate text-sm text-white/55">
                      {artists}
                      {track?.album?.name ? ` • ${track.album.name}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 text-right">
                    <span className="text-xs text-white/45">
                      {getTimeAgo(item.played_at)}
                    </span>
                    <span className="text-sm text-white/70">
                      {formatDuration(track?.duration_ms)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-white/60">Nenhuma música recente encontrada.</p>
      )}
    </section>
  );
}