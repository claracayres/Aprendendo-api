function formatDuration(ms) {
  if (!ms) return "--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function TopTracksList({ topTracks }) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Mais tocadas
          </p>
          <h2 className="text-2xl font-bold text-white">Top músicas</h2>
        </div>
      </div>

      {topTracks.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-[32px_56px_minmax(0,1fr)_auto] gap-4 border-b border-white/5 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white/35">
            <span>#</span>
            <span></span>
            <span>Título</span>
            <span>Duração</span>
          </div>

          <div className="divide-y divide-white/5">
            {topTracks.map((track, index) => (
              <div
                key={track.id}
                className="grid grid-cols-[32px_56px_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04]"
              >
                <span className="text-sm text-white/45">{index + 1}</span>

                <div className="h-14 w-14 overflow-hidden rounded-md bg-white/10">
                  {track?.album?.images?.[0]?.url ? (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {track.name}
                  </p>
                  <p className="truncate text-sm text-white/55">
                    {track.artists?.map((artist) => artist.name).join(", ")}
                    {track?.album?.name ? ` • ${track.album.name}` : ""}
                  </p>
                </div>

                <span className="text-sm text-white/70">
                  {formatDuration(track?.duration_ms)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-white/60">
          Ainda não há dados suficientes para mostrar suas top músicas.
        </p>
      )}
    </section>
  );
}