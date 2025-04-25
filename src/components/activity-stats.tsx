import type { ActivitySession } from "@/components/desk-activity-tracker"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ActivityStatsProps {
  sessions: ActivitySession[]
}

export function ActivityStats({ sessions }: ActivityStatsProps) {
  const formatMinutes = (seconds: number) => {
    return Math.round(seconds / 60)
  }

  const getLastSevenDays = () => {
    if (sessions.length === 0) return []

    const last7Days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const session = sessions.find((s) => s.date === dateString)

      last7Days.push({
        date: dateString.slice(5), // Just month-day
        standing: session ? formatMinutes(session.standingTime) : 0,
        sitting: session ? formatMinutes(session.sittingTime) : 0,
        pushups: session ? session.pushups : 0,
      })
    }

    return last7Days
  }

  const chartData = getLastSevenDays()

  const getTotalPushups = () => {
    return sessions.reduce((total, session) => total + session.pushups, 0)
  }

  const getTotalStandingMinutes = () => {
    return formatMinutes(sessions.reduce((total, session) => total + session.standingTime, 0))
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No activity data yet. Start tracking to see your stats!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <div className="text-sm text-muted-foreground">Total Push-ups</div>
          <div className="text-2xl font-bold">{getTotalPushups()}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-sm text-muted-foreground">Standing (mins)</div>
          <div className="text-2xl font-bold">{getTotalStandingMinutes()}</div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Push-ups Last 7 Days</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="pushups" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">Standing Time Last 7 Days (mins)</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="standing" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
