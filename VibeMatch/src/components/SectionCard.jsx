export default function SectionCard({ children }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        marginBottom: "16px",
        backgroundColor: "#fff",
      }}
    >
      {children}
    </div>
  );
}