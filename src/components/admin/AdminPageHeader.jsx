/**
 * Consistent page chrome for admin routes (matches DashboardLayout indigo accent).
 */
export default function AdminPageHeader({ eyebrow = "Admin", title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="inline-flex items-center rounded-full border border-indigo-200/90 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-800">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
