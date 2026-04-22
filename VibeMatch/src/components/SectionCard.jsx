export default function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-3xl border border-white/10
        bg-white/5 backdrop-blur-xl
        p-4 md:p-5
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:-translate-y-1 hover:border-white/20 hover:bg-white/8
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-70" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}