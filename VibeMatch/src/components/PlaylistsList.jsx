import SectionCard from "./SectionCard";
import MediaItemCard from "./MediaItemCard";

export default function PlaylistsList({ playlists }) {
  return (
    <section className="mb-12">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
          Sua coleção
        </p>
        <h2 className="text-2xl font-bold text-white">Playlists</h2>
      </div>

      {playlists.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {playlists.map((playlist) => (
            <SectionCard key={playlist.id}>
              <MediaItemCard
                image={playlist.images?.[0]?.url}
                title={playlist.name}
                subtitle={
                  playlist.tracks?.total !== undefined
                    ? `${playlist.tracks.total} músicas`
                    : "Quantidade indisponível"
                }
                meta={`por ${playlist.owner?.display_name || "Desconhecido"}`}
                badge="Playlist"
              />
            </SectionCard>
          ))}
        </div>
      ) : (
        <p className="text-white/60">Nenhuma playlist encontrada.</p>
      )}
    </section>
  );
}