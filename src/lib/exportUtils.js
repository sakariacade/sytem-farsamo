// ─── exportPDF ────────────────────────────────────────────────────────────────
export async function exportPDF(tickets, archive) {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const today = new Date().toLocaleDateString('so-SO', { year: 'numeric', month: 'long', day: 'numeric' })
  const totalRevenue = tickets.reduce((s, t) => s + Number(t.qiimo || 0), 0)

  // ── Colour palette ──────────────────────────────────────────────────────────
  const brand   = [30, 86, 160]   // deep blue
  const accent  = [245, 158, 11]  // amber
  const dark    = [15, 23, 42]
  const light   = [241, 245, 249]

  // ── Cover header ────────────────────────────────────────────────────────────
  doc.setFillColor(...brand)
  doc.rect(0, 0, pageW, 36, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.text('ILWAAD SMART SERVICES', pageW / 2, 14, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Nidaamka Farsamada – Laptop & Printer Repair Center', pageW / 2, 22, { align: 'center' })
  doc.text(`Warbixinta taariikhda: ${today}`, pageW / 2, 29, { align: 'center' })

  // ── Summary cards ───────────────────────────────────────────────────────────
  let y = 44
  const cards = [
    { label: 'Tirada Qalabka Jira',   value: String(tickets.length) },
    { label: 'Tirada Kaydka Guud',    value: String(archive.length) },
    { label: 'Dakhliga Wadarta',       value: `$${totalRevenue}` },
  ]
  const cw = (pageW - 20) / 3
  cards.forEach((c, i) => {
    const x = 10 + i * (cw + 0)
    doc.setFillColor(...light)
    doc.roundedRect(x, y, cw - 4, 20, 3, 3, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(...accent)
    doc.text(c.value, x + (cw - 4) / 2, y + 8, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...dark)
    doc.text(c.label, x + (cw - 4) / 2, y + 15, { align: 'center' })
  })

  const cols = ['#', 'ID', 'Macmiilka', 'Tel', 'Nooca', 'Model', "Cilladda / 'Arrinta", 'Qiimaha ($)', 'Taariikh', 'Xaaladda']
  const mapRow = (t, i) => [
    i + 1, t.id, t.macmiil, t.tel, t.nooc, t.model, t.cilaad, t.qiimo, t.taariikh, t.xaalad
  ]

  // ── Active tickets table ─────────────────────────────────────────────────────
  y += 26
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...brand)
  doc.text('🔧  Qalabka Hadda Jira (Active Tickets)', 10, y)
  y += 4

  autoTable(doc, {
    startY: y,
    head: [cols],
    body: tickets.map(mapRow),
    theme: 'grid',
    headStyles: { fillColor: brand, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 7.5, textColor: dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8,  halign: 'center' },
      1: { cellWidth: 22 },
      7: { halign: 'right' },
      9: { cellWidth: 28 },
    },
    margin: { left: 10, right: 10 },
    didDrawPage: (data) => drawFooter(doc, data, today, pageW),
  })

  // ── Archive table ─────────────────────────────────────────────────────────────
  if (archive.length > 0) {
    doc.addPage()
    drawHeader(doc, pageW, today)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...brand)
    doc.text('📦  Kaydka Guud (Archive)', 10, 44)

    autoTable(doc, {
      startY: 50,
      head: [cols],
      body: archive.map(mapRow),
      theme: 'grid',
      headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8, halign: 'center' },
      bodyStyles: { fontSize: 7.5, textColor: dark },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 8,  halign: 'center' },
        1: { cellWidth: 22 },
        7: { halign: 'right' },
        9: { cellWidth: 28 },
      },
      margin: { left: 10, right: 10 },
      didDrawPage: (data) => drawFooter(doc, data, today, pageW),
    })
  }

  doc.save(`ILWAAD_Report_${new Date().toISOString().slice(0, 10)}.pdf`)
}

function drawHeader(doc, pageW, today) {
  const brand = [30, 86, 160]
  doc.setFillColor(...brand)
  doc.rect(0, 0, pageW, 36, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(255, 255, 255)
  doc.text('ILWAAD SMART SERVICES', pageW / 2, 14, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Warbixinta taariikhda: ${today}`, pageW / 2, 28, { align: 'center' })
}

function drawFooter(doc, data, today, pageW) {
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text(`Bogga ${data.pageNumber} / ${pageCount}  •  ILWAAD SMART SERVICES  •  ${today}`, pageW / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' })
}

// ─── exportExcel ───────────────────────────────────────────────────────────────
export async function exportExcel(tickets, archive) {
  const XLSX = await import('xlsx')

  const toRows = (data, type) =>
    data.map(t => ({
      'Nooca': type,
      'ID': t.id,
      'Macmiilka': t.macmiil,
      'Telefoon': t.tel,
      'Nooca Qalabka': t.nooc,
      'Model-ka': t.model,
      "Cilladda": t.cilaad,
      'Qiimaha ($)': Number(t.qiimo) || 0,
      'Taariikh': t.taariikh,
      'Xaaladda': t.xaalad,
    }))

  const wb = XLSX.utils.book_new()

  // Sheet 1 – All Data
  const allRows = [
    ...toRows(tickets, 'Active'),
    { Nooca: '─────', ID: '─────', Macmiilka: '─────', Telefoon: '', 'Nooca Qalabka': '', 'Model-ka': '', Cilladda: '', 'Qiimaha ($)': '', Taariikh: '', Xaaladda: '' },
    ...toRows(archive, 'Archive'),
  ]
  const wsAll = XLSX.utils.json_to_sheet(allRows)
  styleSheet(wsAll, tickets.length, archive.length)
  XLSX.utils.book_append_sheet(wb, wsAll, 'Dhammaan Xogta')

  // Sheet 2 – Active only
  const wsActive = XLSX.utils.json_to_sheet(toRows(tickets, 'Active'))
  styleSheet(wsActive, tickets.length, 0)
  XLSX.utils.book_append_sheet(wb, wsActive, 'Active Tickets')

  // Sheet 3 – Archive only
  const wsArchive = XLSX.utils.json_to_sheet(toRows(archive, 'Archive'))
  styleSheet(wsArchive, 0, archive.length)
  XLSX.utils.book_append_sheet(wb, wsArchive, 'Kaydka Guud')

  // Sheet 4 – Summary
  const totalRevenue = tickets.reduce((s, t) => s + Number(t.qiimo || 0), 0)
  const archiveRevenue = archive.reduce((s, t) => s + Number(t.qiimo || 0), 0)
  const summaryRows = [
    { 'Macluumaadka': 'Tirada Qalabka Jira', 'Qiimaha': tickets.length },
    { 'Macluumaadka': 'Tirada Kaydka Guud', 'Qiimaha': archive.length },
    { 'Macluumaadka': 'Dakhliga Qalabka Jira ($)', 'Qiimaha': totalRevenue },
    { 'Macluumaadka': 'Dakhliga Kaydka Guud ($)', 'Qiimaha': archiveRevenue },
    { 'Macluumaadka': 'Wadarta Dakhliga ($)', 'Qiimaha': totalRevenue + archiveRevenue },
    { 'Macluumaadka': 'Taariikhda', 'Qiimaha': new Date().toLocaleDateString('en-GB') },
  ]
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows)
  wsSummary['!cols'] = [{ wch: 35 }, { wch: 18 }]
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Koobaad')

  XLSX.writeFile(wb, `ILWAAD_Data_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

function styleSheet(ws, ticketCount, archiveCount) {
  const headers = ['Nooca', 'ID', 'Macmiilka', 'Telefoon', 'Nooca Qalabka', 'Model-ka', 'Cilladda', 'Qiimaha ($)', 'Taariikh', 'Xaaladda']
  ws['!cols'] = [8, 14, 22, 15, 14, 18, 30, 12, 14, 20].map(w => ({ wch: w }))
  // Mark the header row as bold (SheetJS CE doesn't support full styles, columns widths are the main thing)
  void headers
  void ticketCount
  void archiveCount
}

// ─── importExcel ───────────────────────────────────────────────────────────────
export async function importExcel(file) {
  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  const wb = XLSX.read(buffer, { type: 'array' })

  // Try to find the combined sheet first; fall back to first sheet
  const sheetName = wb.SheetNames.includes('Dhammaan Xogta')
    ? 'Dhammaan Xogta'
    : wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(ws)

  const tickets = []
  const archive = []

  for (const row of rows) {
    const nooc = String(row['Nooca'] || '').trim()
    if (!row['ID'] || nooc.startsWith('─')) continue

    const item = {
      id:       String(row['ID'] || ''),
      macmiil:  String(row['Macmiilka'] || ''),
      tel:      String(row['Telefoon'] || ''),
      nooc:     String(row['Nooca Qalabka'] || ''),
      model:    String(row['Model-ka'] || ''),
      cilaad:   String(row['Cilladda'] || ''),
      qiimo:    String(row['Qiimaha ($)'] || '0'),
      taariikh: String(row['Taariikh'] || ''),
      xaalad:   String(row['Xaaladda'] || ''),
    }

    if (nooc === 'Archive') {
      archive.push(item)
    } else {
      tickets.push(item)
    }
  }

  return { tickets, archive }
}
