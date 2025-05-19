import React, { useState, useRef, useEffect } from "react"
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import "./TimeRangePicker.css"

interface TimeRangePickerProps {
  onTimeChange?: (startTime: string, endTime: string) => void
  initialStartTime?: string
  initialEndTime?: string
}

export function TimeRangePicker({
  onTimeChange,
  initialStartTime = "09:00",
  initialEndTime = "17:00",
}: TimeRangePickerProps) {
  const [startTime, setStartTime] = useState(initialStartTime)
  const [endTime, setEndTime] = useState(initialEndTime)
  const [activeField, setActiveField] = useState<"start" | "end" | null>(null)
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(startTime, endTime)
    }
  }, [startTime, endTime, onTimeChange])

  // Convert time string (HH:MM) to minutes
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Convert minutes to time string (HH:MM)
  const convertMinutesToTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60) % 24
    const minutes = totalMinutes % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`
  }

  // Adjust time by specified minutes
  const adjustTime = (
    time: string,
    minutesToAdd: number,
    isStartTime: boolean
  ): string => {
    const totalMinutes = convertTimeToMinutes(time) + minutesToAdd

    if (isStartTime && totalMinutes < 0) {
      return "00:00"
    } else if (!isStartTime && totalMinutes >= 24 * 60) {
      return "23:59"
    }

    const adjustedMinutes = Math.max(0, Math.min(totalMinutes, 24 * 60 - 1))
    return convertMinutesToTime(adjustedMinutes)
  }

  // Handle wheel event to increment/decrement time
  const handleWheel = (e: React.WheelEvent, field: "start" | "end") => {
    const direction = e.deltaY < 0 ? 1 : -1
    const adjustment = direction * 5 // 5-minute increments

    if (field === "start") {
      setStartTime(adjustTime(startTime, adjustment, true))
    } else {
      setEndTime(adjustTime(endTime, adjustment, false))
    }
  }

  const handleHourChange = (direction: number, field: "start" | "end") => {
    const adjustment = direction * 60 // 1-hour increments (60 minutes)

    if (field === "start") {
      setStartTime(adjustTime(startTime, adjustment, true))
    } else {
      setEndTime(adjustTime(endTime, adjustment, false))
    }
  }

  // Handle manual input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "start" | "end"
  ) => {
    const value = e.target.value

    if (field === "start") {
      setStartTime(value)
    } else {
      setEndTime(value)
    }
  }

  // Handle blur to format and validate the input
  const handleBlur = (field: "start" | "end") => {
    setActiveField(null)

    const timeValue = field === "start" ? startTime : endTime

    if (!timeValue.trim()) {
      if (field === "start") {
        setStartTime("00:00")
      } else {
        setEndTime("23:59")
      }
      return
    }

    if (/^([0-1]?[0-9]|2[0-3]):?([0-5][0-9])?$/.test(timeValue)) {
      let hours = 0
      let minutes = 0

      if (timeValue.includes(":")) {
        const [h, m] = timeValue.split(":")
        hours = Number.parseInt(h, 10)
        minutes = m ? Number.parseInt(m, 10) : 0
      } else if (timeValue.length <= 2) {
        hours = Number.parseInt(timeValue, 10)
        minutes = 0
      } else if (timeValue.length <= 4) {
        hours = Number.parseInt(timeValue.substring(0, timeValue.length - 2), 10)
        minutes = Number.parseInt(timeValue.substring(timeValue.length - 2), 10)
      }

      hours = Math.max(0, Math.min(hours, 23))
      minutes = Math.max(0, Math.min(minutes, 59))

      minutes = Math.round(minutes / 5) * 5
      if (minutes === 60) {
        minutes = 55
      }

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`

      if (field === "start") {
        setStartTime(formattedTime)
      } else {
        setEndTime(formattedTime)
      }
    } else {
      if (field === "start") {
        setStartTime(initialStartTime)
      } else {
        setEndTime(initialEndTime)
      }
    }
  }

  return (
    <div className="time-range-picker">
      <div
        className={`time-field ${activeField === "start" ? "active" : ""}`}
      >
        <label className="time-label" htmlFor="start-time">Start Time</label>
        <div className="time-input-container">
          <button
            className="time-control"
            onClick={() => handleHourChange(1, "start")}
            type="button"
          >
            <ArrowDropUpIcon fontSize="small" />
          </button>
          <input
            id="start-time"
            ref={startRef}
            type="text"
            value={startTime}
            onChange={(e) => handleInputChange(e, "start")}
            onWheel={(e) => handleWheel(e, "start")}
            onFocus={() => setActiveField("start")}
            onBlur={() => handleBlur("start")}
            spellCheck={false}
            autoComplete="off"
            className="input-field"
          />
          <button
            className="time-control"
            onClick={() => handleHourChange(-1, "start")}
            type="button"
          >
            <ArrowDropDownIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className={`time-field ${activeField === "end" ? "active" : ""}`}>
        <label className="time-label" htmlFor="end-time">End Time</label>
        <div className="time-input-container">
          <button
            className="time-control"
            onClick={() => handleHourChange(1, "end")}
            type="button"
          >
            <ArrowDropUpIcon fontSize="small" />
          </button>
          <input
            id="end-time"
            ref={endRef}
            type="text"
            value={endTime}
            onChange={(e) => handleInputChange(e, "end")}
            onWheel={(e) => handleWheel(e, "end")}
            onFocus={() => setActiveField("end")}
            onBlur={() => handleBlur("end")}
            spellCheck={false}
            autoComplete="off"
            className="input-field"
          />
          <button
            className="time-control"
            onClick={() => handleHourChange(-1, "end")}
            type="button"
          >
            <ArrowDropDownIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  )
}