export default function ReviewsAdminLoading() {
  return (
    <main className="space-y-8 p-8">
      <section className="animate-pulse rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />

          <div className="flex-1">
            <div className="h-8 w-64 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-100" />
            <div className="mt-2 h-4 w-full max-w-md rounded bg-slate-100" />
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            key={index}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="mt-4 h-9 w-20 rounded bg-slate-200" />
            <div className="mt-3 h-3 w-36 rounded bg-slate-100" />
          </article>
        ))}
      </section>

      {Array.from({ length: 4 }).map((_, index) => (
        <section
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="h-7 w-56 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-100" />

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((__, fieldIndex) => (
              <div key={fieldIndex}>
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="mt-2 h-12 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}