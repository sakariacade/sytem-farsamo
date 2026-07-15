import { useState, useEffect } from 'react'
import { initialTickets, initialArchive } from './data/initialData'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import BackupBar from './components/BackupBar'
import FeedbackBanner from './components/FeedbackBanner'
import TicketForm from './components/TicketForm'
import TicketsTable from './components/TicketsTable'
import ArchiveTable from './components/ArchiveTable'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('ilwaad_auth') === 'true')
  const [tickets, setTickets] = useState(initialTickets)
  const [archive, setArchive] = useState(initialArchive)
  const [searchTerm, setSearchTerm] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLogin = () => {
    sessionStorage.setItem('ilwaad_auth', 'true')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('ilwaad_auth')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  // ─── Load data on mount ───────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedTickets = localStorage.getItem('ilwaad_tickets')
        const savedArchive = localStorage.getItem('ilwaad_archive')
        const response = await fetch('/api/data')

        if (response.ok) {
          const data = await response.json()
          if (data?.tickets && data?.archive) {
            setTickets(data.tickets)
            setArchive(data.archive)
            localStorage.setItem('ilwaad_tickets', JSON.stringify(data.tickets))
            localStorage.setItem('ilwaad_archive', JSON.stringify(data.archive))
          } else if (savedTickets && savedArchive) {
            setTickets(JSON.parse(savedTickets))
            setArchive(JSON.parse(savedArchive))
          }
        } else if (savedTickets && savedArchive) {
          setTickets(JSON.parse(savedTickets))
          setArchive(JSON.parse(savedArchive))
        }
      } catch {
        const savedTickets = localStorage.getItem('ilwaad_tickets')
        const savedArchive = localStorage.getItem('ilwaad_archive')
        if (savedTickets && savedArchive) {
          setTickets(JSON.parse(savedTickets))
          setArchive(JSON.parse(savedArchive))
        }
      } finally {
        setIsLoaded(true)
      }
    }
    loadData()
  }, [])

  // ─── Sync data to server + localStorage whenever state changes ────────────
  const syncData = async (nextTickets, nextArchive) => {
    if (!isLoaded) return
    try {
      localStorage.setItem('ilwaad_tickets', JSON.stringify(nextTickets))
      localStorage.setItem('ilwaad_archive', JSON.stringify(nextArchive))
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets: nextTickets, archive: nextArchive })
      })
    } catch {
      // Keep local copy on sync failure
    }
  }

  useEffect(() => {
    if (!isLoaded) return
    syncData(tickets, archive)
  }, [tickets, archive, isLoaded])

  // ─── Poll server every 3 seconds for multi-device sync ───────────────────
  useEffect(() => {
    if (!isLoaded) return
    const id = window.setInterval(async () => {
      try {
        const response = await fetch('/api/data')
        if (!response.ok) return
        const data = await response.json()
        if (data?.tickets && data?.archive) {
          setTickets(data.tickets)
          setArchive(data.archive)
          localStorage.setItem('ilwaad_tickets', JSON.stringify(data.tickets))
          localStorage.setItem('ilwaad_archive', JSON.stringify(data.archive))
        }
      } catch {
        // Ignore refresh failures
      }
    }, 3000)
    return () => window.clearInterval(id)
  }, [isLoaded])

  // ─── Backup handlers ──────────────────────────────────────────────────────
  const exportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ tickets, archive }))
    const link = document.createElement('a')
    link.href = dataStr
    link.download = 'ILWAAD_Data_Backup.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const importBackup = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (parsed.tickets && parsed.archive) {
          setTickets(parsed.tickets)
          setArchive(parsed.archive)
          alert('✅ Xogtii si guul leh ayaa loo soo celiyey!')
        } else {
          alert('❌ Faylkan sax maahan!')
        }
      } catch {
        alert('❌ Khalad ayaa dhacay markii faylka la akhriyay.')
      }
    }
    reader.readAsText(file, 'UTF-8')
  }

  // ─── Ticket handlers ──────────────────────────────────────────────────────
  const handleAddTicket = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev])
    setFeedback(`✅ Qalab cusub waa la kaydiyey: ${newTicket.id}`)
  }

  const handleStatusChange = (id, newStatus) => {
    setTickets((prev) => prev.map((item) => (item.id === id ? { ...item, xaalad: newStatus } : item)))
  }

  const handleArchive = (ticket) => {
    if (window.confirm(`Ma hubtaa in qalabkan (${ticket.id}) loo wareejiyo kaydka guud?`)) {
      setArchive((prev) => [{ ...ticket, xaalad: 'La Bixiyay' }, ...prev])
      setTickets((prev) => prev.filter((item) => item.id !== ticket.id))
      setFeedback(`📦 ${ticket.id} waa la dhigay kaydka guud.`)
    }
  }

  const handlePermanentDelete = (id) => {
    if (window.confirm('Ma hubtaa inaad tirtirto?')) {
      setArchive((prev) => prev.filter((item) => item.id !== id))
      setFeedback('🗑️ Qalabku waa la tirtiray.')
    }
  }

  // ─── Filtered lists ───────────────────────────────────────────────────────
  const filterFn = (item) => {
    const q = searchTerm.toLowerCase()
    return (
      item.macmiil.toLowerCase().includes(q) ||
      item.tel.includes(searchTerm) ||
      item.id.toLowerCase().includes(q)
    )
  }

  const filteredTickets = tickets.filter(filterFn)
  const filteredArchive = archive.filter(filterFn)
  const totalRevenue = tickets.reduce((sum, item) => sum + Number(item.qiimo || 0), 0)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_#f8fafc_55%,_#eef2ff_100%)] text-gray-800">
      <Header searchTerm={searchTerm} onSearch={setSearchTerm} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <BackupBar onExport={exportBackup} onImport={importBackup} />

        {feedback && <FeedbackBanner message={feedback} />}

        <StatsBar
          ticketCount={tickets.length}
          archiveCount={archive.length}
          totalRevenue={totalRevenue}
        />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TicketForm onAddTicket={handleAddTicket} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <TicketsTable
              tickets={filteredTickets}
              onStatusChange={handleStatusChange}
              onArchive={handleArchive}
            />
            <ArchiveTable
              archive={filteredArchive}
              onDelete={handlePermanentDelete}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
