"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ESTADOS_LEAD } from "@/lib/constants"

interface LeadChartProps {
  data: Record<string, number>
}

const COLORS = {
  entrante: "#3B82F6",
  contactado: "#F59E0B",
  evaluando: "#6C47FF",
  ganado: "#10B981",
  perdido: "#EF4444",
}

export function LeadChart({ data }: LeadChartProps) {
  const chartData = Object.entries(data).map(([estado, count]) => ({
    name: ESTADOS_LEAD[estado as keyof typeof ESTADOS_LEAD],
    value: count,
    estado,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">{data.value} leads</p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0 || chartData.every((item) => item.value === 0)) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No hay datos para mostrar</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.estado as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
