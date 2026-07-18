'use server'

import { prisma } from '../lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTickets() {
  const allData = await prisma.technical.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  // Map back ticketId to id for frontend compatibility
  const formattedData = allData.map(d => ({
    id: d.ticketId,
    macmiil: d.macmiil,
    tel: d.tel,
    nooc: d.nooc,
    model: d.model,
    cilaad: d.cilaad,
    qiimo: d.qiimo,
    taariikh: d.taariikh,
    xaalad: d.xaalad,
    isArchived: d.isArchived
  }))

  const tickets = formattedData.filter(d => !d.isArchived)
  const archive = formattedData.filter(d => d.isArchived)
  
  return { tickets, archive }
}

export async function addTicket(ticketData) {
  await prisma.technical.create({
    data: {
      ticketId: ticketData.id,
      macmiil: ticketData.macmiil,
      tel: ticketData.tel,
      nooc: ticketData.nooc,
      model: ticketData.model,
      cilaad: ticketData.cilaad,
      qiimo: String(ticketData.qiimo),
      taariikh: ticketData.taariikh,
      xaalad: ticketData.xaalad,
      isArchived: false
    }
  })
  revalidatePath('/')
}

export async function updateTicketStatus(ticketId, newStatus) {
  await prisma.technical.update({
    where: { ticketId },
    data: { xaalad: newStatus }
  })
  revalidatePath('/')
}

export async function archiveTicket(ticketId) {
  await prisma.technical.update({
    where: { ticketId },
    data: { 
      isArchived: true,
      xaalad: 'La Bixiyay'
    }
  })
  revalidatePath('/')
}

export async function deleteTicket(ticketId) {
  await prisma.technical.delete({
    where: { ticketId }
  })
  revalidatePath('/')
}

export async function syncAllData(tickets, archive) {
  await prisma.technical.deleteMany()
  
  const dataToInsert = [
    ...tickets.map(t => ({
      ticketId: t.id,
      macmiil: t.macmiil,
      tel: t.tel,
      nooc: t.nooc,
      model: t.model,
      cilaad: t.cilaad,
      qiimo: String(t.qiimo),
      taariikh: t.taariikh,
      xaalad: t.xaalad,
      isArchived: false
    })),
    ...archive.map(t => ({
      ticketId: t.id,
      macmiil: t.macmiil,
      tel: t.tel,
      nooc: t.nooc,
      model: t.model,
      cilaad: t.cilaad,
      qiimo: String(t.qiimo),
      taariikh: t.taariikh,
      xaalad: t.xaalad,
      isArchived: true
    }))
  ]
  
  for(const item of dataToInsert) {
    await prisma.technical.create({ data: item })
  }
  revalidatePath('/')
}
