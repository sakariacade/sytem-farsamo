'use client'

import { useState, useEffect } from 'react'
import LoginPage from './LoginPage'
import Header from './Header'
import StatsBar from './StatsBar'
import BackupBar from './BackupBar'
import FeedbackBanner from './FeedbackBanner'
import TicketForm from './TicketForm'
import TicketsTable from './TicketsTable'
import ArchiveTable from './ArchiveTable'
import { addTicket, updateTicketStatus, archiveTicket, deleteTicket, syncAllData } from '../actions/tickets'

export default function Dashboard({ initialTickets, initialArchive }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [tickets, setTickets] = useState(initialTickets)
  const [archive, setArchive] = useState(initialArchive)
  const [searchTerm, setSearchTerm] = useState('')
  const [feedback, setFeedback] = useState('')

  // Sync state with props when revalidation happens from server actions
  useEffect(() => {
    setTickets(initialTickets)
    setArchive(initialArchive)
  }, [initialTickets, initialArchive])

  useEffect(() => {
    setIsLoggedIn(sessionStorage.getItem('ilwaad_auth') === 'true')
  }, [])

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

  const exportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ tickets, archive }))
    const link = document.createElement('a')
    link.href = dataStr
    link.download = 'ILWAAD_Data_Backup.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const importBackup = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (parsed.tickets && parsed.archive) {
          setTickets(parsed.tickets)
          setArchive(parsed.archive)
          await syncAllData(parsed.tickets, parsed.archive)
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

  const handleAddTicket = async (newTicket) => {
    setTickets((prev) => [newTicket, ...prev])
    setFeedback(`✅ Qalab cusub waa la kaydiyey: ${newTicket.id}`)
    await addTicket(newTicket)
  }

  const handleStatusChange = async (id, newStatus) => {
    setTickets((prev) => prev.map((item) => (item.id === id ? { ...item, xaalad: newStatus } : item)))
    await updateTicketStatus(id, newStatus)
  }

  const handleArchive = async (ticket) => {
    if (window.confirm(`Ma hubtaa in qalabkan (${ticket.id}) loo wareejiyo kaydka guud?`)) {
      setArchive((prev) => [{ ...ticket, xaalad: 'La Bixiyay' }, ...prev])
      setTickets((prev) => prev.filter((item) => item.id !== ticket.id))
      setFeedback(`📦 ${ticket.id} waa la dhigay kaydka guud.`)
      await archiveTicket(ticket.id)
    }
  }

  const handlePermanentDelete = async (id) => {
    if (window.confirm('Ma hubtaa inaad tirtirto?')) {
      setArchive((prev) => prev.filter((item) => item.id !== id))
      setFeedback('🗑️ Qalabku waa la tirtiray.')
      await deleteTicket(id)
    }
  }

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
    <>
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
    </>
  )
}
