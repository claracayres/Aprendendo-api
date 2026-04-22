export default function MediaItemCard({
  image,
  title,
  subtitle,
  meta,
  badge,
  extra,
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover shadow-lg"
          />
        ) : (
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/10" />
        )}

        {badge && (
          <div className="absolute -top-2 -left-2 rounded-full border border-white/10 bg-black/70 px-2 py-1 text-xs font-semibold text-white shadow-md">
            {badge}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm md:text-base font-semibold text-white">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 truncate text-sm text-white/70">{subtitle}</p>
        )}

        {meta && (
          <p className="mt-1 truncate text-xs md:text-sm text-white/45">
            {meta}
          </p>
        )}

        {extra && <div className="mt-3">{extra}</div>}
      </div>
    </div>
  );
}