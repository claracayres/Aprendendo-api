import SectionCard from "./SectionCard";
import MediaItemCard from "./MediaItemCard";

export default function TopTracksList({ topTracks }) {
  return (
    <section className="mb-12">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
          Mais tocadas
        </p>
        <h2 className="text-2xl font-bold text-white">Top músicas</h2>
      </div>

      {topTracks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topTracks.map((track, index) => (
            <SectionCard key={track.id}>
              <MediaItemCard
                image={track.album?.images?.[0]?.url}
                title={track.name}
                subtitle={track.artists?.map((artist) => artist.name).join(", ")}
                meta={track.album?.name}
                badge={`#${index + 1}`}
              />
            </SectionCard>
          ))}
        </div>
      ) : (
        <p className="text-white/60">
          Ainda não há dados suficientes para mostrar suas top músicas.
        </p>
      )}
    </section>
  );
}