import { useState } from 'react'
import { statusOptions } from '../data/initialData'

function renderNoocIcon(nooc) {
  if (nooc === 'Laptop') return '💻 Laptop'
  if (nooc === 'Printer') return '🖨️ Printer'
  return '📦 All-in-One'
}

export default function TicketsTable({ tickets, onStatusChange, onArchive, onDownloadSelected }) {
  const [selected, setSelected] = useState(new Set())

  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === tickets.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(tickets.map(t => t.id)))
    }
  }

  const handleDownload = () => {
    const items = tickets.filter(t => selected.has(t.id))
    onDownloadSelected(items, 'Qalabka Jira')
    setSelected(new Set())
  }

  const allChecked = tickets.length > 0 && selected.size === tickets.length
  const someChecked = selected.size > 0 && selected.size < tickets.length

  return (
    <div className="bg-white/95 rounded-3xl p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] border border-gray-100">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-600">Qalabka</p>
          <h2 className="text-lg font-black text-slate-800">Gacanta ku jira</h2>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition-all hover:-translate-y-0.5"
            >
              📄 PDF ({selected.size})
            </button>
          )}
          <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-700 shadow-sm">
            {tickets.length} total
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={el => { if (el) el.indeterminate = someChecked }}
                  onChange={toggleAll}
                  className="rounded cursor-pointer accent-blue-600"
                  title="Dhammaan xuli"
                />
              </th>
              <th className="p-3">ID / Taariikh</th>
              <th className="p-3">Macmiilka</th>
              <th className="p-3">Nooca &amp; Model</th>
              <th className="p-3">Qiimaha</th>
              <th className="p-3">Xaalad</th>
              <th className="p-3">Aaladaha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Ma jiro natiijooyin la soo bandhigay.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className={`hover:bg-gray-50 transition-colors ${selected.has(ticket.id) ? 'bg-blue-50/60' : ''}`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(ticket.id)}
                      onChange={() => toggleOne(ticket.id)}
                      className="rounded cursor-pointer accent-blue-600"
                    />
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-blue-600 block">{ticket.id}</span>
                    <span className="text-[11px] text-gray-400">{ticket.taariikh}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold block">{ticket.macmiil}</span>
                    <span className="text-xs text-gray-400">{ticket.tel}</span>
                  </td>
                  <td className="p-3">
                    <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded mb-1">
                      {renderNoocIcon(ticket.nooc)}
                    </span>
                    <span className="block text-gray-700 text-xs">{ticket.model}</span>
                    <span className="text-[10px] text-gray-400">{ticket.cilaad}</span>
                  </td>
                  <td className="p-3 font-bold text-gray-800">${ticket.qiimo}</td>
                  <td className="p-3">
                    <select
                      value={ticket.xaalad}
                      onChange={(e) => onStatusChange(ticket.id, e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white p-1.5 text-xs font-bold"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onArchive(ticket)}
                      className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1.5 rounded-lg text-xs font-bold"
                    >
                      📦 Bixi (kaydi)
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
