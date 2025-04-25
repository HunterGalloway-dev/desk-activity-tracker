"use client"

import { useState, useEffect } from "react"
import { Clock, ArrowDown, ArrowUp, RotateCcw, Settings, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimerDisplay } from "@/components/timer-display"
import { PushupTracker } from "@/components/pushup-tracker"
import { ActivitySettings } from "@/components/activity-settings"
import { ActivityStats } from "@/components/activity-stats"
import { toast } from "sonner"

export type ActivityState = "standing" | "pushups" | "sitting" | "idle"
export type ActivitySession = {
  date: string
  standingTime: number
  sittingTime: number
  pushups: number
}

export function DeskActivityTracker() {
  const [activeState, setActiveState] = useState<ActivityState>("idle")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [pushupCount, setPushupCount] = useState(0)
  const [standingInterval, setStandingInterval] = useState(25 * 60) // 25 minutes in seconds
  const [sittingInterval, setSittingInterval] = useState(35 * 60) // 35 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [sessions, setSessions] = useState<ActivitySession[]>([])
  const [currentTab, setCurrentTab] = useState("timer")

  // Load saved settings and sessions from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("deskTrackerSettings")
    if (savedSettings) {
      const { standing, sitting } = JSON.parse(savedSettings)
      setStandingInterval(standing)
      setSittingInterval(sitting)
    }

    const savedSessions = localStorage.getItem("deskTrackerSessions")
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions))
    }
  }, [])

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("deskTrackerSessions", JSON.stringify(sessions))
    }
  }, [sessions])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (isActive && timeRemaining === 0) {
      if (activeState === "standing") {
        toast.info("Time to do push-ups!", {
          description: "Complete your push-ups before sitting down.",
        })
        setActiveState("pushups")
      } else if (activeState === "sitting") {
        toast.info("Time to stand up!", {
          description: "Your sitting interval is complete.",
        })
        startStanding()
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining, activeState])

  const startStanding = () => {
    setActiveState("standing")
    setTimeRemaining(standingInterval)
    setIsActive(true)
  }

  const startSitting = () => {
    // Record the session
    const today = new Date().toISOString().split("T")[0]
    const existingSessionIndex = sessions.findIndex((session) => session.date === today)

    if (existingSessionIndex >= 0) {
      const updatedSessions = [...sessions]
      updatedSessions[existingSessionIndex] = {
        ...updatedSessions[existingSessionIndex],
        pushups: updatedSessions[existingSessionIndex].pushups + pushupCount,
        standingTime:
          updatedSessions[existingSessionIndex].standingTime +
          standingInterval -
          (activeState === "standing" ? timeRemaining : 0),
      }
      setSessions(updatedSessions)
    } else {
      setSessions([
        ...sessions,
        {
          date: today,
          standingTime: standingInterval - (activeState === "standing" ? timeRemaining : 0),
          sittingTime: 0,
          pushups: pushupCount,
        },
      ])
    }

    setActiveState("sitting")
    setTimeRemaining(sittingInterval)
    setIsActive(true)
    setPushupCount(0)
  }

  const resetTimer = () => {
    setIsActive(false)
    setActiveState("idle")
    setTimeRemaining(0)
    setPushupCount(0)
  }

  const saveSettings = (standing: number, sitting: number) => {
    setStandingInterval(standing)
    setSittingInterval(sitting)
    localStorage.setItem("deskTrackerSettings", JSON.stringify({ standing, sitting }))
    toast.success("Settings saved", {
      description: "Your interval settings have been updated.",
    })
  }

  const getStateColor = () => {
    switch (activeState) {
      case "standing":
        return "bg-green-100 border-green-200 dark:bg-green-950 dark:border-green-900"
      case "pushups":
        return "bg-yellow-100 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900"
      case "sitting":
        return "bg-blue-100 border-blue-200 dark:bg-blue-950 dark:border-blue-900"
      default:
        return "bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    }
  }

  const getStateIcon = () => {
    switch (activeState) {
      case "standing":
        return <ArrowUp className="h-6 w-6 text-green-500" />
      case "pushups":
        return <RotateCcw className="h-6 w-6 text-yellow-500" />
      case "sitting":
        return <ArrowDown className="h-6 w-6 text-blue-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-500" />
    }
  }

  const getStateText = () => {
    switch (activeState) {
      case "standing":
        return "Standing"
      case "pushups":
        return "Do Push-ups"
      case "sitting":
        return "Sitting"
      default:
        return "Not Started"
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Desk Activity</CardTitle>
          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-medium ${getStateColor()}`}
            >
              {getStateIcon()}
              <span>{getStateText()}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timer">
              <Clock className="mr-2 h-4 w-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart2 className="mr-2 h-4 w-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-4">
            <TimerDisplay timeRemaining={timeRemaining} activeState={activeState} isActive={isActive} />

            {activeState === "pushups" && (
              <PushupTracker pushupCount={pushupCount} setPushupCount={setPushupCount} onComplete={startSitting} />
            )}

            <div className="flex flex-col space-y-2">
              {activeState === "idle" && (
                <Button onClick={startStanding} className="bg-green-600 hover:bg-green-700">
                  Start Standing
                </Button>
              )}

              {activeState === "standing" && isActive && (
                <Button onClick={() => setActiveState("pushups")} className="bg-yellow-600 hover:bg-yellow-700">
                  Finish Standing & Do Push-ups
                </Button>
              )}

              {(activeState === "standing" || activeState === "sitting" || activeState === "pushups") && (
                <Button variant="outline" onClick={resetTimer}>
                  Reset
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <ActivitySettings
              standingInterval={standingInterval}
              sittingInterval={sittingInterval}
              onSave={saveSettings}
            />
          </TabsContent>

          <TabsContent value="stats">
            <ActivityStats sessions={sessions} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Track your desk activity to maintain a healthy work routine
      </CardFooter>
    </Card>
  )
}