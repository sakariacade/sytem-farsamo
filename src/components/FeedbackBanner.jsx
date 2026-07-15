export default function FeedbackBanner({ message }) {
  if (!message) return null
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
      {message}
    </section>
  )
}
