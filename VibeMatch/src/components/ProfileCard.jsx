export default function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <section className="mb-10">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="shrink-0">
              {user.images?.[0] ? (
                <img
                  src={user.images[0].url}
                  alt={user.display_name}
                  className="h-24 w-24 rounded-full border border-white/15 object-cover shadow-lg md:h-28 md:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl font-bold text-white/80 md:h-28 md:w-28">
                  {user.display_name?.[0] || "?"}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                Perfil Spotify
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                {user.display_name}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/65 md:text-base">
                Seu perfil musical conectado ao VibeMatch. Aqui começa a leitura
                da sua vibe, compatibilidade e identidade sonora.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {user.email && (
                  <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-white/75 md:text-sm">
                    {user.email}
                  </span>
                )}

                {user.country && (
                  <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-white/75 md:text-sm">
                    País: {user.country}
                  </span>
                )}

                {user.product && (
                  <span className="rounded-full border border-accent/20 bg-accent/15 px-3 py-1.5 text-xs font-medium text-white md:text-sm">
                    Plano: {user.product}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[340px]">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                Status
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                Conectado
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                Fonte
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                Spotify
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                Mood base
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                Musical DNA
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}