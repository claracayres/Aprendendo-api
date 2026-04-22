import SectionCard from "./SectionCard";

export default function TopArtistsList({ topArtists }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>Top Artistas</h2>

      {topArtists.length > 0 ? (
        <div>
          {topArtists.map((artist, index) => (
            <SectionCard key={artist.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {artist.images?.[0] && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    width="60"
                    height="60"
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  />
                )}

                <div>
                  <p style={{ margin: 0 }}>
                    <strong>
                      {index + 1}. {artist.name}
                    </strong>
                  </p>
                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#333",
                      fontSize: "14px",
                      lineHeight: 1.4,
                    }}
                  >
                    <strong>Generos:</strong>{" "}
                    {artist.genres?.length > 0
                      ? artist.genres.slice(0, 3).join(", ")
                      : "Sem generos disponiveis"}
                  </p>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      ) : (
        <p>Ainda nao ha dados suficientes para mostrar seus top artistas.</p>
      )}
    </div>
  );
}
