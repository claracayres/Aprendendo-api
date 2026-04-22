import SectionCard from "./SectionCard";
import MediaItemCard from "./MediaItemCard";

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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topArtists.map((artist, index) => (
            <SectionCard key={artist.id}>
              <MediaItemCard
                image={artist.images?.[0]?.url}
                title={artist.name}
                subtitle={
                  artist.genres?.length > 0
                    ? artist.genres.slice(0, 2).join(" • ")
                    : "Sem gêneros disponíveis"
                }
                meta="Artista mais ouvido"
                badge={`#${index + 1}`}
                extra={
                  <div className="flex flex-wrap gap-2">
                    {(artist.genres || []).slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[11px] text-white/70"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                }
              />
            </SectionCard>
          ))}
        </div>
      ) : (
        <p className="text-white/60">
          Ainda não há dados suficientes para mostrar seus top artistas.
        </p>
      )}
    </section>
  );
}