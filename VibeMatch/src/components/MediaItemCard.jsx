export default function MediaItemCard({
  image,
  title,
  subtitle,
  meta,
  badge,
  extra,
}) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          {badge && (
            <span className="absolute -left-2 -top-2 rounded-full bg-black/80 px-2 py-1 text-xs font-semibold text-white">
              {badge}
            </span>
          )}

          {image ? (
            <img
              src={image}
              alt={title}
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-white/50">
              ?
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-white">{title}</h3>

          {subtitle && (
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/65">
              {subtitle}
            </p>
          )}

          {meta && (
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">
              {meta}
            </p>
          )}
        </div>
      </div>

      {extra ? <div className="mt-auto">{extra}</div> : null}
    </div>
  );
}