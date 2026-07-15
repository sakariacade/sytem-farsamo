export default function StatsBar({ ticketCount, archiveCount, totalRevenue }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-[0_14px_35px_rgba(59,130,246,0.25)]">
        <p className="text-sm text-blue-100">Qalabka hadda gacanta ku jira</p>
        <p className="mt-2 text-3xl font-black">{ticketCount}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-blue-100">Aynu ku aragno si cad</p>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-700 to-slate-900 p-4 text-white shadow-[0_14px_35px_rgba(15,23,42,0.2)]">
        <p className="text-sm text-slate-300">Qalabka la bixiyay</p>
        <p className="mt-2 text-3xl font-black">{archiveCount}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-300">Kaydka guud</p>
      </div>

      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-500 to-green-600 p-4 text-white shadow-[0_14px_35px_rgba(16,185,129,0.22)]">
        <p className="text-sm text-emerald-100">Wadarta lacagta</p>
        <p className="mt-2 text-3xl font-black">${totalRevenue}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-emerald-100">Korsari</p>
      </div>
    </section>
  )
}
