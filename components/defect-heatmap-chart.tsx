"use client"

interface HeatmapData {
  day: string
  hour: number
  defects: number
}

interface DefectHeatmapChartProps {
  data: HeatmapData[]
}

export function DefectHeatmapChart({ data }: DefectHeatmapChartProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getIntensity = (defects: number) => {
    const maxDefects = Math.max(...data.map((d) => d.defects))
    return maxDefects > 0 ? defects / maxDefects : 0
  }

  const getColor = (intensity: number) => {
    if (intensity === 0) return "#f3f4f6"
    if (intensity < 0.2) return "#dbeafe"
    if (intensity < 0.4) return "#93c5fd"
    if (intensity < 0.6) return "#60a5fa"
    if (intensity < 0.8) return "#3b82f6"
    return "#1d4ed8"
  }

  const getCellData = (day: string, hour: number) => {
    return data.find((d) => d.day === day && d.hour === hour) || { day, hour, defects: 0 }
  }

  return (
    <div className="h-80">
      <div className="w-full h-full overflow-auto">
        <div className="min-w-[800px] h-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12"></div>
            {hours.map((hour) => (
              <div key={hour} className="w-8 text-xs text-center text-gray-600">
                {hour}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {days.map((day) => (
            <div key={day} className="flex mb-1">
              <div className="w-12 text-xs text-right pr-2 py-1 text-gray-600">{day}</div>
              {hours.map((hour) => {
                const cellData = getCellData(day, hour)
                const intensity = getIntensity(cellData.defects)
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="w-8 h-6 border border-gray-200 flex items-center justify-center text-xs cursor-pointer hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: getColor(intensity) }}
                    title={`${day} ${hour}:00 - ${cellData.defects} defects`}
                  >
                    {cellData.defects > 0 ? cellData.defects : ""}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center mt-4 text-xs text-gray-600">
            <span className="mr-2">Less</span>
            <div className="flex">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
                <div
                  key={i}
                  className="w-4 h-4 border border-gray-200"
                  style={{ backgroundColor: getColor(intensity) }}
                />
              ))}
            </div>
            <span className="ml-2">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
