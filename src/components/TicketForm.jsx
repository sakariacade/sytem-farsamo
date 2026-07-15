import { useState } from 'react'
import { deviceTypes } from '../data/initialData'

const inputClass = 'w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50/50'

export default function TicketForm({ onAddTicket }) {
  const [macmiil, setMacmiil] = useState('')
  const [tel, setTel] = useState('')
  const [nooc, setNooc] = useState('Laptop')
  const [model, setModel] = useState('')
  const [cilaad, setCilaad] = useState('')
  const [qiimo, setQiimo] = useState('')
  const [taariikh, setTaariikh] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!macmiil || !tel || !model || !cilaad || !qiimo || !taariikh) {
      alert('Fadlan buuxi dhammaan meelaha bannaan!')
      return
    }

    const newTicket = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      macmiil,
      tel,
      nooc,
      model,
      cilaad,
      qiimo,
      taariikh,
      xaalad: 'Baadhitaan'
    }

    onAddTicket(newTicket)

    // Reset form
    setMacmiil('')
    setTel('')
    setModel('')
    setCilaad('')
    setQiimo('')
    setTaariikh(new Date().toISOString().split('T')[0])
    setNooc('Laptop')
  }

  return (
    <div className="bg-white/90 rounded-3xl p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] border border-gray-100 backdrop-blur">
      <h2 className="text-xl font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">
        📥 Diwaangeli qalab cusub
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 text-xs font-bold uppercase mb-1">Magaca macmiilka</label>
          <input
            type="text"
            value={macmiil}
            onChange={(e) => setMacmiil(e.target.value)}
            placeholder="Cali Axmed"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-gray-600 text-xs font-bold uppercase mb-1">Taleefanka</label>
          <input
            type="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="061XXXXXXX"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 text-xs font-bold uppercase mb-1">Nooca</label>
            <select
              value={nooc}
              onChange={(e) => setNooc(e.target.value)}
              className={inputClass}
            >
              {deviceTypes.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 text-xs font-bold uppercase mb-1">Qiimaha ($)</label>
            <input
              type="number"
              value={qiimo}
              onChange={(e) => setQiimo(e.target.value)}
              placeholder="20"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-600 text-xs font-bold uppercase mb-1">Taariikhda</label>
          <input
            type="date"
            value={taariikh}
            onChange={(e) => setTaariikh(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-gray-600 text-xs font-bold uppercase mb-1">Model-ka</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="HP EliteBook"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-gray-600 text-xs font-bold uppercase mb-1">Ciladda</label>
          <textarea
            rows="3"
            value={cilaad}
            onChange={(e) => setCilaad(e.target.value)}
            placeholder="Sharaxaad kooban"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-transform duration-150 hover:-translate-y-0.5"
        >
          💾 Kaydi qalabka
        </button>
      </form>
    </div>
  )
}
