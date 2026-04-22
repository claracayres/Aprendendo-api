import SectionCard from "./SectionCard";

export default function RecentTracksList({ recentTracks }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>Músicas ouvidas recentemente</h2>

      {recentTracks.length > 0 ? (
        <div>
          {recentTracks.map((item, index) => {
            const track = item.track;

            return (
              <SectionCard key={`${track?.id}-${index}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {track?.album?.images?.[0] && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      width="60"
                      height="60"
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  )}

                  <div>
                    <p style={{ margin: 0 }}>
                      <strong>{track?.name}</strong>
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      {track?.artists?.map((artist) => artist.name).join(", ")}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                      {track?.album?.name}
                    </p>
                  </div>
                </div>
              </SectionCard>
            );
          })}
        </div>
      ) : (
        <p>Nenhuma música recente encontrada.</p>
      )}
    </div>
  );
}