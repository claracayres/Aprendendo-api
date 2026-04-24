export default function ProfileCard({ user }) {
  if (!user) return null;

  const image = user.images?.[0]?.url;
  const name = user.display_name || "Spotify User";

  return (
    <section className="h-full">
      <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#101216] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/18 via-white/[0.03] to-purple-500/12" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-green-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col justify-between gap-8">
          <div className="flex flex-col gap-6 sm:items-center">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-green-400/30 blur-xl" />

              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="relative h-24 w-24 rounded-full border-2 border-white/20 object-cover shadow-2xl md:h-28 md:w-28"
                />
              ) : (
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-3xl font-black text-white md:h-28 md:w-28">
                  {name[0]}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.28em] text-green-300/70">
                Perfil Spotify
              </p>

              <h2 className="mt-2 truncate text-3xl font-black tracking-tight text-white md:text-4xl">
                {name}
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                Seu perfil musical conectado ao VibeMatch. Aqui começa sua
                leitura de vibe, identidade sonora e compatibilidade musical.
              </p>
            </div>
          </div>

          <div className="grid gap-3 grid-cols-1 lg:grid-cols-3">
            <InfoCard label="Status" value="Conectado" />
            <InfoCard label="Fonte" value="Spotify" />
            <InfoCard label="Mood base" value="Musical DNA" />
          </div>

          <div className="flex flex-wrap gap-2">
            {user.email && <Badge>{user.email}</Badge>}
            {user.country && <Badge>País: {user.country}</Badge>}
            {user.product && <Badge destaque>Plano: {user.product}</Badge>}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-green-400/30 hover:bg-white/[0.06]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function Badge({ children, destaque = false }) {
  return (
    <span
      className={`rounded-full border px-3 py-1.5 text-xs font-medium md:text-sm ${
        destaque
          ? "border-green-400/25 bg-green-400/15 text-green-200"
          : "border-white/10 bg-white/[0.07] text-white/70"
      }`}
    >
      {children}
    </span>
  );
}