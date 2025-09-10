"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutGrid,
  TableIcon,
  Search,
  Filter,
  Plus,
  LogOut,
  Package,
  Download,
  BarChart3,
  Settings,
} from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth"
import type { Lead } from "@/lib/types"
import { ESTADOS_LEAD } from "@/lib/constants"
import { LeadModal } from "@/components/lead-modal"
import { KanbanBoard } from "@/components/kanban-board"
import { LeadsTable } from "@/components/leads-table"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view")
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban")

  useEffect(() => {
    loadLeads()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, searchTerm, statusFilter])

  const loadLeads = () => {
    const allLeads = dataStore.getLeads()
    setLeads(allLeads)
  }

  const filterLeads = () => {
    let filtered = leads

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.estado === statusFilter)
    }

    setFilteredLeads(filtered)
  }

  const handleCreateLead = () => {
    setSelectedLead(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setModalMode("view")
    setIsModalOpen(true)
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleDeleteLead = (leadId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este lead?")) {
      dataStore.deleteLead(leadId)
      loadLeads()
    }
  }

  const handleLeadSaved = () => {
    loadLeads()
    setIsModalOpen(false)
  }

  const handleStatusChange = (leadId: string, newStatus: Lead["estado"]) => {
    dataStore.updateLead(leadId, { estado: newStatus })
    loadLeads()
  }

  const exportToCSV = () => {
    const headers = ["Nombre", "Apellido", "Empresa", "Email", "Teléfono", "Estado", "Fecha Creación"]
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map((lead) =>
        [
          lead.nombre,
          lead.apellido,
          lead.empresa,
          lead.email,
          lead.telefono,
          ESTADOS_LEAD[lead.estado],
          new Date(lead.fechaCreacion).toLocaleDateString("es-AR"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `leads-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
                  <h1 className="text-xl font-semibold text-gray-900">Panel de Control</h1>
                  <p className="text-sm text-gray-500">Gestión de Leads</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <a href="/admin/reportes">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Reportes
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/admin/configuracion">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </a>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Leads</CardDescription>
                <CardTitle className="text-2xl">{leads.length}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Nuevos (Entrante)</CardDescription>
                <CardTitle className="text-2xl text-blue-600">
                  {leads.filter((l) => l.estado === "entrante").length}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>En Proceso</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">
                  {leads.filter((l) => ["contactado", "evaluando"].includes(l.estado)).length}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Ganados</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {leads.filter((l) => l.estado === "ganado").length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(ESTADOS_LEAD).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>

              <Button onClick={handleCreateLead} className="bg-[#6C47FF] hover:bg-[#5A3AD1]">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Lead
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "kanban" | "table")}>
            <TabsList className="mb-6">
              <TabsTrigger value="kanban">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Vista Kanban
              </TabsTrigger>
              <TabsTrigger value="table">
                <TableIcon className="w-4 h-4 mr-2" />
                Vista Tabla
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kanban">
              <KanbanBoard
                leads={filteredLeads}
                onViewLead={handleViewLead}
                onEditLead={handleEditLead}
                onDeleteLead={handleDeleteLead}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>

            <TabsContent value="table">
              <LeadsTable
                leads={filteredLeads}
                onViewLead={handleViewLead}
                onEditLead={handleEditLead}
                onDeleteLead={handleDeleteLead}
              />
            </TabsContent>
          </Tabs>
        </main>

        {/* Lead Modal */}
        <LeadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          lead={selectedLead}
          mode={modalMode}
          onSave={handleLeadSaved}
        />
      </div>
    </AuthGuard>
  )
}
