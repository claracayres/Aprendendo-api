export default function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>Perfil</h2>

      {user.images?.[0] && (
        <img
          src={user.images[0].url}
          alt={user.display_name}
          width="100"
          height="100"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "16px",
          }}
        />
      )}

      <p>
        <strong>Nome:</strong> {user.display_name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>País:</strong> {user.country}
      </p>
      <p>
        <strong>Plano:</strong> {user.product}
      </p>
    </div>
  );
}