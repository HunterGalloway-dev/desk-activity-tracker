"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MinusCircle, PlusCircle } from "lucide-react"

interface PushupTrackerProps {
  pushupCount: number
  setPushupCount: (count: number) => void
  onComplete: () => void
}

export function PushupTracker({ pushupCount, setPushupCount, onComplete }: PushupTrackerProps) {
  const increment = () => {
    setPushupCount(pushupCount + 1)
  }

  const decrement = () => {
    if (pushupCount > 0) {
      setPushupCount(pushupCount - 1)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-medium">Push-up Count</h3>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={decrement} disabled={pushupCount === 0}>
            <MinusCircle className="h-5 w-5" />
          </Button>

          <span className="text-3xl font-bold w-16 text-center">{pushupCount}</span>

          <Button variant="outline" size="icon" onClick={increment}>
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>

        <Button onClick={onComplete} className="w-full bg-blue-600 hover:bg-blue-700">
          Complete & Start Sitting
        </Button>
      </div>
    </Card>
  )
}
