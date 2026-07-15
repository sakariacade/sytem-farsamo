import { useState } from 'react'

const VALID_USER = 'ilwaad'
const VALID_PASS = 'ilwaad'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate a brief loading moment for UX polish
    setTimeout(() => {
      if (username === VALID_USER && password === VALID_PASS) {
        onLogin()
      } else {
        setError('Magaca isticmaalaha ama furaha waa khalad. Isku day mar kale.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#1e3a5f,_#0f172a_55%,_#1e1b4b_100%)] flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">

          {/* Logo + Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-black shadow-[0_8px_24px_rgba(59,130,246,0.5)] mb-4">
              ILW
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">ILWAAD SMART SERVICES</h1>
            <p className="text-blue-300 text-xs uppercase tracking-[0.3em] mt-1">Nidaamka Farsamada</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-300 text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">
                Magaca Isticmaalaha
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ilwaad"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">
                Furaha Sirta
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors text-lg"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-[0_8px_24px_rgba(59,130,246,0.35)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Soo gelaya...
                </span>
              ) : '🔐 Gal'}
            </button>
          </form>

          <p className="text-center text-white/20 text-xs mt-8">
            © 2026 ILWAAD SMART SERVICES
          </p>
        </div>
      </div>
    </div>
  )
}
