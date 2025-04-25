import type { ActivityState } from "@/components/desk-activity-tracker"
import { Progress } from "@/components/ui/progress"

interface TimerDisplayProps {
  timeRemaining: number
  activeState: ActivityState
  isActive: boolean
}

export function TimerDisplay({ timeRemaining, activeState, isActive }: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressColor = () => {
    switch (activeState) {
      case "standing":
        return "bg-green-500"
      case "sitting":
        return "bg-blue-500"
      default:
        return ""
    }
  }

  const getMaxTime = () => {
    switch (activeState) {
      case "standing":
        return 25 * 60 // This should ideally be passed from parent
      case "sitting":
        return 35 * 60 // This should ideally be passed from parent
      default:
        return 100
    }
  }

  const getProgressValue = () => {
    if (!isActive || activeState === "idle" || activeState === "pushups") return 0
    const maxTime = getMaxTime()
    return ((maxTime - timeRemaining) / maxTime) * 100
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="text-4xl font-bold tabular-nums">{isActive ? formatTime(timeRemaining) : "00:00"}</div>
        <div className="text-sm text-muted-foreground">
          {activeState === "standing" && "Time left standing"}
          {activeState === "sitting" && "Time left sitting"}
          {activeState === "pushups" && "Complete your push-ups"}
          {activeState === "idle" && "Start your activity"}
        </div>
      </div>

      {(activeState === "standing" || activeState === "sitting") && isActive && (
        <Progress value={getProgressValue()} className={`h-2 ${getProgressColor()}`} />
      )}
    </div>
  )
}
