export default function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`
        group relative h-full overflow-hidden rounded-3xl border border-white/10
        bg-white/5 p-4 md:p-5 backdrop-blur-xl
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:border-white/20 hover:bg-white/[0.07]
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}