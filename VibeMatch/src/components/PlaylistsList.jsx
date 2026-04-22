import SectionCard from "./SectionCard";

export default function PlaylistsList({ playlists }) {
  return (
    <div>
      <h2>Suas playlists</h2>

      {playlists.length > 0 ? (
        <div>
          {playlists.map((playlist) => (
            <SectionCard key={playlist.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {playlist.images?.[0] && (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    width="60"
                    height="60"
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  />
                )}

                <div>
                  <p style={{ margin: 0 }}>
                    <strong>{playlist.name}</strong>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    {playlist.tracks?.total !== undefined
                      ? `${playlist.tracks.total} músicas`
                      : "Quantidade indisponível"}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                    por {playlist.owner?.display_name || "Desconhecido"}
                  </p>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      ) : (
        <p>Nenhuma playlist encontrada.</p>
      )}
    </div>
  );
}