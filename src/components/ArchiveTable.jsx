function renderNoocIcon(nooc) {
  if (nooc === 'Laptop') return '💻 Laptop'
  if (nooc === 'Printer') return '🖨️ Printer'
  return '📦 All-in-One'
}

export default function ArchiveTable({ archive, onDelete }) {
  return (
    <div className="bg-gray-50/90 rounded-3xl p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] border border-gray-200">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">Kaydka</p>
          <h2 className="text-lg font-black text-slate-800">Qalabka la bixiyay</h2>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 shadow-sm">
          {archive.length} total
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-3">ID / Taariikh</th>
              <th className="p-3">Macmiilka</th>
              <th className="p-3">Nooca &amp; Model</th>
              <th className="p-3">Qiimaha</th>
              <th className="p-3">Xaalad</th>
              <th className="p-3">Xakamayn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {archive.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Ma jiro wax archive ah.
                </td>
              </tr>
            ) : (
              archive.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <span className="font-bold text-gray-500 block">{item.id}</span>
                    <span className="text-[11px] text-gray-400">{item.taariikh}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold block">{item.macmiil}</span>
                    <span className="text-xs text-gray-400">{item.tel}</span>
                  </td>
                  <td className="p-3">
                    <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-0.5 rounded mb-1">
                      {renderNoocIcon(item.nooc)}
                    </span>
                    <span className="block text-gray-700 text-xs">{item.model}</span>
                    <span className="text-[10px] text-gray-400">{item.cilaad}</span>
                  </td>
                  <td className="p-3 font-bold text-gray-700">${item.qiimo}</td>
                  <td className="p-3">
                    <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-md border border-gray-200">
                      ✅ {item.xaalad}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold"
                    >
                      ❌ Tir-tir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
