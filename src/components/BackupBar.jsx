export default function BackupBar({ onExportPDF, onExportExcel, onImport }) {
  return (
    <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-sm">
      <div>
        <h2 className="font-bold text-yellow-800">⚠️ Badbaadi xogtaada</h2>
        <p className="text-sm text-yellow-700">
          Xogtaadu waxa la keydinayaa server-kaaga. Waxaad soo dejisan kartaa PDF ama Excel, oo waxaad ku soo celin kartaa Excel.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onExportPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-transform duration-150 hover:-translate-y-0.5 flex items-center gap-1"
        >
          📄 PDF Warbixin
        </button>
        <button
          onClick={onExportExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-transform duration-150 hover:-translate-y-0.5 flex items-center gap-1"
        >
          📊 Excel Xogta
        </button>
        <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 flex items-center gap-1">
          📤 Soo celi (Excel)
          <input type="file" accept=".xlsx,.xls" onChange={onImport} className="hidden" />
        </label>
      </div>
    </section>
  )
}
