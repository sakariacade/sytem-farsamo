import { getTickets } from '../actions/tickets'
import Dashboard from '../components/Dashboard'

export default async function Page() {
  const { tickets, archive } = await getTickets()
  
  return <Dashboard initialTickets={tickets} initialArchive={archive} />
}
