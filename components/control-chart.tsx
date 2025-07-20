"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface ControlData {
  sample: number
  value: number
  ucl: number
  lcl: number
  centerLine: number
}

interface ControlChartProps {
  data: ControlData[]
}

export function ControlChart({ data }: ControlChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">Sample {label}</p>
          <p className="text-blue-600">Value: {data?.value?.toFixed(2)}</p>
          <p className="text-red-600">UCL: {data?.ucl}</p>
          <p className="text-green-600">Center: {data?.centerLine}</p>
          <p className="text-red-600">LCL: {data?.lcl}</p>
          {(data?.value > data?.ucl || data?.value < data?.lcl) && (
            <p className="text-red-600 font-bold">⚠️ Out of Control</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="sample" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />

          {/* Control limits */}
          <ReferenceLine y={data[0]?.ucl} stroke="#ef4444" strokeDasharray="5 5" label="UCL" />
          <ReferenceLine y={data[0]?.centerLine} stroke="#22c55e" strokeDasharray="5 5" label="Center" />
          <ReferenceLine y={data[0]?.lcl} stroke="#ef4444" strokeDasharray="5 5" label="LCL" />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Process Value"
            dot={(props) => {
              const { payload } = props
              const isOutOfControl = payload.value > payload.ucl || payload.value < payload.lcl
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={4}
                  fill={isOutOfControl ? "#ef4444" : "#3b82f6"}
                  stroke={isOutOfControl ? "#dc2626" : "#2563eb"}
                  strokeWidth={2}
                />
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
