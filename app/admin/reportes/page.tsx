"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown, Users, DollarSign, Target, Download, Package, LogOut } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth"
import type { Lead, Reporte } from "@/lib/types"
import { ESTADOS_LEAD } from "@/lib/constants"
import { LeadChart } from "@/components/lead-chart"
import { ConversionFunnel } from "@/components/conversion-funnel"

export default function ReportesPage() {
  const { user, logout } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [reporte, setReporte] = useState<Reporte | null>(null)
  const [timeRange, setTimeRange] = useState("30") // days
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterLeadsByTimeRange()
  }, [leads, timeRange])

  const loadData = () => {
    const allLeads = dataStore.getLeads()
    setLeads(allLeads)
    const reporteData = dataStore.getReporte()
    setReporte(reporteData)
  }

  const filterLeadsByTimeRange = () => {
    const days = Number.parseInt(timeRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const filtered = leads.filter((lead) => new Date(lead.fechaCreacion) >= cutoffDate)
    setFilteredLeads(filtered)
  }

  const getTimeRangeStats = () => {
    const totalLeads = filteredLeads.length
    const leadsPorEstado = filteredLeads.reduce(
      (acc, lead) => {
        acc[lead.estado] = (acc[lead.estado] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const leadsGanados = leadsPorEstado.ganado || 0
    const conversionRate = totalLeads > 0 ? (leadsGanados / totalLeads) * 100 : 0

    const valorTotalGanado = filteredLeads
      .filter((lead) => lead.estado === "ganado" && lead.valorEstimado)
      .reduce((sum, lead) => sum + (lead.valorEstimado || 0), 0)

    return {
      totalLeads,
      leadsPorEstado,
      conversionRate,
      valorTotalGanado,
    }
  }

  const getTopEmpresas = () => {
    const empresaCount = filteredLeads.reduce(
      (acc, lead) => {
        acc[lead.empresa] = (acc[lead.empresa] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(empresaCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  const getLeadsTrend = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split("T")[0]
    })

    return last30Days.map((date) => {
      const count = leads.filter((lead) => lead.fechaCreacion.split("T")[0] === date).length
      return { date, count }
    })
  }

  const exportReport = () => {
    const stats = getTimeRangeStats()
    const topEmpresas = getTopEmpresas()

    const reportData = [
      "REPORTE DE LEADS - " + new Date().toLocaleDateString("es-AR"),
      "",
      "RESUMEN GENERAL:",
      `Total de Leads (últimos ${timeRange} días): ${stats.totalLeads}`,
      `Tasa de Conversión: ${stats.conversionRate.toFixed(1)}%`,
      `Valor Total Ganado: $${stats.valorTotalGanado.toLocaleString("es-AR")}`,
      "",
      "LEADS POR ESTADO:",
      ...Object.entries(stats.leadsPorEstado).map(
        ([estado, count]) => `${ESTADOS_LEAD[estado as keyof typeof ESTADOS_LEAD]}: ${count}`,
      ),
      "",
      "TOP 5 EMPRESAS:",
      ...topEmpresas.map(([empresa, count]) => `${empresa}: ${count} leads`),
    ].join("\n")

    const blob = new Blob([reportData], { type: "text/plain;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `reporte-leads-${new Date().toISOString().split("T")[0]}.txt`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!reporte) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C47FF] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reportes...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const timeRangeStats = getTimeRangeStats()
  const topEmpresas = getTopEmpresas()
  const leadsTrend = getLeadsTrend()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Package className="w-8 h-8 text-[#6C47FF]" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Reportes y Analytics</h1>
                  <p className="text-sm text-gray-500">Análisis de rendimiento de leads</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <a href="/admin/dashboard">Volver al Dashboard</a>
                </Button>
                <span className="text-sm text-gray-600">Hola, {user?.nombre}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 días</SelectItem>
                  <SelectItem value="30">Últimos 30 días</SelectItem>
                  <SelectItem value="90">Últimos 90 días</SelectItem>
                  <SelectItem value="365">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={exportReport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Total Leads</CardDescription>
                  <Users className="w-4 h-4 text-gray-500" />
                </div>
                <CardTitle className="text-2xl">{timeRangeStats.totalLeads}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  Período seleccionado
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Tasa de Conversión</CardDescription>
                  <Target className="w-4 h-4 text-gray-500" />
                </div>
                <CardTitle className="text-2xl">{timeRangeStats.conversionRate.toFixed(1)}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600">
                  {timeRangeStats.conversionRate > 20 ? (
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                  )}
                  {timeRangeStats.conversionRate > 20 ? "Excelente" : "Mejorable"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Valor Ganado</CardDescription>
                  <DollarSign className="w-4 h-4 text-gray-500" />
                </div>
                <CardTitle className="text-2xl">${timeRangeStats.valorTotalGanado.toLocaleString("es-AR")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  ARS
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>Leads Ganados</CardDescription>
                  <Target className="w-4 h-4 text-gray-500" />
                </div>
                <CardTitle className="text-2xl text-green-600">{timeRangeStats.leadsPorEstado.ganado || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  Cerrados exitosamente
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Estado</CardTitle>
                <CardDescription>Leads por cada etapa del proceso</CardDescription>
              </CardHeader>
              <CardContent>
                <LeadChart data={timeRangeStats.leadsPorEstado} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Embudo de Conversión</CardTitle>
                <CardDescription>Flujo de leads a través del proceso</CardDescription>
              </CardHeader>
              <CardContent>
                <ConversionFunnel data={timeRangeStats.leadsPorEstado} />
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Empresas</CardTitle>
                <CardDescription>Empresas con más leads generados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topEmpresas.map(([empresa, count], index) => (
                    <div key={empresa} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#6C47FF] text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{empresa}</span>
                      </div>
                      <Badge variant="secondary">{count} leads</Badge>
                    </div>
                  ))}
                  {topEmpresas.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No hay datos disponibles</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen por Estado</CardTitle>
                <CardDescription>Detalle de leads en cada etapa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(ESTADOS_LEAD).map(([estado, label]) => {
                    const count = timeRangeStats.leadsPorEstado[estado] || 0
                    const percentage = timeRangeStats.totalLeads > 0 ? (count / timeRangeStats.totalLeads) * 100 : 0

                    return (
                      <div key={estado} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-[#6C47FF]"></div>
                          <span className="font-medium">{label}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{count}</div>
                          <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
