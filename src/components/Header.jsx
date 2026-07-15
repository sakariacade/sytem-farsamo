export default function Header({ searchTerm, onSearch, onLogout }) {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 text-white shadow-[0_20px_60px_rgba(15,23,42,0.28)]">
      <div className="container mx-auto px-4 py-7 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white text-blue-700 rounded-2xl w-13 h-13 flex items-center justify-center text-xl font-black shadow-lg">
            ILW
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              ILWAAD SMART SERVICES
            </h1>
            <p className="text-blue-100 text-xs uppercase tracking-[0.35em]">
              Laptop &amp; Printer Repair Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="🔍 Raadi magac, taleefon, ama ID"
              className="w-full px-4 py-2.5 rounded-full text-gray-800 border border-white/20 bg-white/95 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            onClick={onLogout}
            title="Ka bax"
            className="flex-shrink-0 bg-white/10 hover:bg-red-500/80 border border-white/20 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
          >
            🚪 Ka bax
          </button>
        </div>
      </div>
    </header>
  )
}
