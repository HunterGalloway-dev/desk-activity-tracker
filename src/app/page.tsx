import { DeskActivityTracker } from "@/components/desk-activity-tracker"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Desk Activity Tracker</h1>
      <DeskActivityTracker />
    </main>
  )
}
