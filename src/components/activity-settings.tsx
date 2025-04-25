"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface ActivitySettingsProps {
  standingInterval: number
  sittingInterval: number
  onSave: (standing: number, sitting: number) => void
}

export function ActivitySettings({ standingInterval, sittingInterval, onSave }: ActivitySettingsProps) {
  const [standingMinutes, setStandingMinutes] = useState(Math.floor(standingInterval / 60))
  const [sittingMinutes, setSittingMinutes] = useState(Math.floor(sittingInterval / 60))

  const handleSave = () => {
    onSave(standingMinutes * 60, sittingMinutes * 60)
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="standing-interval">Standing Interval (minutes)</Label>
          <Input
            id="standing-interval"
            type="number"
            min="1"
            max="120"
            value={standingMinutes}
            onChange={(e) => setStandingMinutes(Number.parseInt(e.target.value) || 1)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sitting-interval">Sitting Interval (minutes)</Label>
          <Input
            id="sitting-interval"
            type="number"
            min="1"
            max="120"
            value={sittingMinutes}
            onChange={(e) => setSittingMinutes(Number.parseInt(e.target.value) || 1)}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </div>
    </Card>
  )
}
