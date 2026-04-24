export default function TopArtistsList({ topArtists }) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Seu ranking
          </p>
          <h2 className="text-2xl font-bold text-white">Top artistas</h2>
        </div>
      </div>

      {topArtists.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-[32px_56px_minmax(0,1fr)_auto] gap-4 border-b border-white/5 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white/35">
            <span>#</span>
            <span></span>
            <span>Artista</span>
            <span>Gêneros</span>
          </div>

          <div className="divide-y divide-white/5">
            {topArtists.map((artist, index) => (
              <div
                key={artist.id}
                className="grid grid-cols-[32px_56px_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04]"
              >
                <span className="text-sm text-white/45">{index + 1}</span>

                <div className="h-14 w-14 overflow-hidden rounded-full bg-white/10">
                  {artist?.images?.[0]?.url ? (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {artist.name}
                  </p>
                  <p className="truncate text-sm text-white/55">
                    Artista mais ouvido
                  </p>
                </div>

                <div className="max-w-[220px] text-right">
                  <p className="truncate text-sm text-white/65">
                    {artist.genres?.length > 0
                      ? artist.genres.slice(0, 2).join(" • ")
                      : "Sem gêneros"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-white/60">
          Ainda não há dados suficientes para mostrar seus top artistas.
        </p>
      )}
    </section>
  );
}