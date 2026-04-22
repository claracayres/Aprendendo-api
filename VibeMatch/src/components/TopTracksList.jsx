import SectionCard from "./SectionCard";

export default function TopTracksList({ topTracks }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>Top Músicas</h2>

      {topTracks.length > 0 ? (
        <div>
          {topTracks.map((track, index) => (
            <SectionCard key={track.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {track.album?.images?.[0] && (
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
                    <strong>
                      {index + 1}. {track.name}
                    </strong>
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    {track.artists?.map((artist) => artist.name).join(", ")}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                    {track.album?.name}
                  </p>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      ) : (
        <p>Ainda não há dados suficientes para mostrar suas top músicas.</p>
      )}
    </div>
  );
}