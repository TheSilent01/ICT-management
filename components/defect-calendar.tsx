"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { ICTDefect } from "@/types/defect";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Filter } from "lucide-react"


interface DefectCalendarProps {
  defects: ICTDefect[]
}

export function DefectCalendar({ defects }: DefectCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [filterSeverity, setFilterSeverity] = useState<string>("all")

  // Group defects by date
  const defectsByDate = defects.reduce(
    (acc, defect) => {
      const date = new Date(defect.timestamp).toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(defect)
      return acc
    },
    {} as Record<string, ICTDefect[]>,
  )

  // Get defects for selected date
  const selectedDateDefects = selectedDate ? defectsByDate[selectedDate.toDateString()] || [] : []

  // Filter defects by severity if needed
  const filteredSelectedDefects =
    filterSeverity === "all" ? selectedDateDefects : selectedDateDefects.filter((d) => d.severity === filterSeverity)

  // Create modifiers for calendar
  const modifiers = {
    hasDefects: Object.keys(defectsByDate).map((dateStr) => new Date(dateStr)),
    highSeverity: Object.entries(defectsByDate)
      .filter(([, defects]) => defects.some((d) => d.severity === "high"))
      .map(([dateStr]) => new Date(dateStr)),
    mediumSeverity: Object.entries(defectsByDate)
      .filter(
        ([, defects]) => defects.some((d) => d.severity === "medium") && !defects.some((d) => d.severity === "high"),
      )
      .map(([dateStr]) => new Date(dateStr)),
  }

  const modifiersStyles = {
    hasDefects: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      fontWeight: "bold",
    },
    highSeverity: {
      backgroundColor: "#fecaca",
      color: "#dc2626",
      fontWeight: "bold",
    },
    mediumSeverity: {
      backgroundColor: "#fef3c7",
      color: "#d97706",
      fontWeight: "bold",
    },
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "resolved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className="rounded-md border"
        month={new Date(2025, 6)} // July 2025
      />

      {selectedDate && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  aria-label="Filter defects"
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {filteredSelectedDefects.length > 0 ? (
              <div className="space-y-3">
                {filteredSelectedDefects.map((defect) => (
                  <div
                    key={defect.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium">{defect.id}</p>
                        <Badge className={getSeverityColor(defect.severity)} variant="secondary">
                          {defect.severity}
                        </Badge>
                        <Badge className={getStatusColor(defect.status)} variant="secondary">
                          {defect.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {defect.component} - {defect.partNumber}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Operator: {defect.operator}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(defect.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">{defect.assignedTo}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No defects reported on this date
                {filterSeverity !== "all" && ` with ${filterSeverity} severity`}
              </p>
            )}

            {selectedDateDefects.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total: {selectedDateDefects.length} defects</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-red-600">
                      High: {selectedDateDefects.filter((d) => d.severity === "high").length}
                    </span>
                    <span className="text-yellow-600">
                      Medium: {selectedDateDefects.filter((d) => d.severity === "medium").length}
                    </span>
                    <span className="text-green-600">
                      Low: {selectedDateDefects.filter((d) => d.severity === "low").length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span>Days with defects</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <span>Days with high severity defects</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
          <span>Days with medium severity defects</span>
        </div>
      </div>
    </div>
  )
}
