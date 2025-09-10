"use client"

interface ConversionFunnelProps {
  data: Record<string, number>
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const funnelSteps = [
    { key: "entrante", label: "Leads Entrantes", color: "bg-blue-500" },
    { key: "contactado", label: "Contactados", color: "bg-yellow-500" },
    { key: "evaluando", label: "En Evaluación", color: "bg-purple-500" },
    { key: "ganado", label: "Ganados", color: "bg-green-500" },
  ]

  const maxValue = Math.max(...Object.values(data))

  return (
    <div className="space-y-4">
      {funnelSteps.map((step, index) => {
        const count = data[step.key] || 0
        const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0

        return (
          <div key={step.key} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{step.label}</span>
              <span className="text-sm text-gray-600">{count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
              <div
                className={`h-full ${step.color} transition-all duration-500 ease-out flex items-center justify-end pr-3`}
                style={{ width: `${Math.max(percentage, count > 0 ? 10 : 0)}%` }}
              >
                {count > 0 && <span className="text-white text-xs font-medium">{percentage.toFixed(0)}%</span>}
              </div>
            </div>
          </div>
        )
      })}

      {/* Conversion Rate */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Tasa de Conversión</span>
          <span className="text-sm font-bold text-green-600">
            {data.entrante > 0 ? (((data.ganado || 0) / data.entrante) * 100).toFixed(1) : 0}%
          </span>
        </div>
      </div>
    </div>
  )
}
