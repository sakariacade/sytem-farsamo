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
import { exportPDF, exportExcel, importExcel, exportSelectedPDF } from '../lib/exportUtils'

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

  const handleExportPDF = async () => {
    try {
      await exportPDF(tickets, archive)
    } catch (err) {
      console.error(err)
      alert('❌ PDF-ka soo dejista waa fashilantay. Isku day mar kale.')
    }
  }

  const handleExportExcel = async () => {
    try {
      await exportExcel(tickets, archive)
    } catch (err) {
      console.error(err)
      alert('❌ Excel-ka soo dejista waa fashilantay. Isku day mar kale.')
    }
  }

  const handleImportExcel = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { tickets: importedTickets, archive: importedArchive } = await importExcel(file)
      if (!importedTickets.length && !importedArchive.length) {
        alert('❌ Faylkan xog kuma jirto ama qaabkiisu sax ma aha.')
        return
      }
      setTickets(importedTickets)
      setArchive(importedArchive)
      await syncAllData(importedTickets, importedArchive)
      setFeedback(`✅ ${importedTickets.length} tickets iyo ${importedArchive.length} archive waa la soo celiyey!`)
    } catch (err) {
      console.error(err)
      alert('❌ Khalad ayaa dhacay markii Excel-ka la akhriyay. Hubi faylka saxda ah.')
    }
    // Reset input so same file can be re-imported
    e.target.value = ''
  }

  const handleDownloadSelected = async (items, label) => {
    try {
      await exportSelectedPDF(items, label)
    } catch (err) {
      console.error(err)
      alert('❌ PDF-ka soo dejista waa fashilantay.')
    }
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
        <BackupBar onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} onImport={handleImportExcel} />
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
              onDownloadSelected={handleDownloadSelected}
            />
            <ArchiveTable
              archive={filteredArchive}
              onDelete={handlePermanentDelete}
              onDownloadSelected={handleDownloadSelected}
            />
          </div>
        </section>
      </main>
    </>
  )
}
