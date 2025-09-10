"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, Mail, Phone } from "lucide-react"
import type { Lead } from "@/lib/types"
import { ESTADOS_LEAD, COLORES_ESTADO } from "@/lib/constants"

interface KanbanBoardProps {
  leads: Lead[]
  onViewLead: (lead: Lead) => void
  onEditLead: (lead: Lead) => void
  onDeleteLead: (leadId: string) => void
  onStatusChange: (leadId: string, newStatus: Lead["estado"]) => void
}

export function KanbanBoard({ leads, onViewLead, onEditLead, onDeleteLead, onStatusChange }: KanbanBoardProps) {
  const columns = Object.entries(ESTADOS_LEAD) as [Lead["estado"], string][]

  const getLeadsByStatus = (status: Lead["estado"]) => {
    return leads.filter((lead) => lead.estado === status)
  }

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: Lead["estado"]) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData("text/plain")
    onStatusChange(leadId, newStatus)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {columns.map(([status, label]) => {
        const statusLeads = getLeadsByStatus(status)
        return (
          <div
            key={status}
            className="bg-gray-100 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <Badge variant="secondary">{statusLeads.length}</Badge>
            </div>

            <div className="space-y-3">
              {statusLeads.map((lead) => (
                <Card
                  key={lead.id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {lead.nombre} {lead.apellido}
                        </CardTitle>
                        <p className="text-xs text-gray-600 mt-1">{lead.empresa}</p>
                      </div>
                      <Badge className={COLORES_ESTADO[lead.estado]} variant="secondary">
                        {ESTADOS_LEAD[lead.estado]}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <Mail className="w-3 h-3 mr-1" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        {lead.telefono}
                      </div>

                      {lead.mensaje && <p className="text-xs text-gray-600 line-clamp-2 mt-2">{lead.mensaje}</p>}

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(lead.fechaCreacion).toLocaleDateString("es-AR")}
                        </span>

                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => onViewLead(lead)} className="h-6 w-6 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => onEditLead(lead)} className="h-6 w-6 p-0">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteLead(lead.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {statusLeads.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">No hay leads en este estado</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
