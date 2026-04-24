export default function PlaylistsList({ playlists }) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Sua biblioteca
          </p>
          <h2 className="text-2xl font-bold text-white">Playlists</h2>
        </div>
      </div>

      {playlists.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-[56px_minmax(0,1fr)_auto_auto] gap-4 border-b border-white/5 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white/35">
            <span></span>
            <span>Playlist</span>
            <span>Músicas</span>
            <span>Criador</span>
          </div>

          <div className="divide-y divide-white/5">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="grid grid-cols-[56px_minmax(0,1fr)_auto_auto] items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04]"
              >
                <div className="h-14 w-14 overflow-hidden rounded-md bg-white/10">
                  {playlist?.images?.[0]?.url ? (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {playlist.name}
                  </p>
                  <p className="truncate text-sm text-white/55">
                    Playlist salva na sua biblioteca
                  </p>
                </div>

                <span className="text-sm text-white/70">
                  {playlist?.tracks?.total ?? 0}
                </span>

                <span className="max-w-[140px] truncate text-sm text-white/55">
                  {playlist?.owner?.display_name || "Desconhecido"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-white/60">Nenhuma playlist encontrada.</p>
      )}
    </section>
  );
}