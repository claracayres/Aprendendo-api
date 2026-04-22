import SectionCard from "./SectionCard";
import MediaItemCard from "./MediaItemCard";

export default function RecentTracksList({ recentTracks }) {
  return (
    <section className="mb-12">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
          Atividade recente
        </p>
        <h2 className="text-2xl font-bold text-white">
          Ouvidas recentemente
        </h2>
      </div>

      {recentTracks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentTracks.map((item, index) => {
            const track = item.track;

            return (
              <SectionCard key={`${track?.id}-${index}`}>
                <MediaItemCard
                  image={track?.album?.images?.[0]?.url}
                  title={track?.name}
                  subtitle={track?.artists?.map((artist) => artist.name).join(", ")}
                  meta={track?.album?.name}
                  badge="Recente"
                />
              </SectionCard>
            );
          })}
        </div>
      ) : (
        <p className="text-white/60">Nenhuma música recente encontrada.</p>
      )}
    </section>
  );
}