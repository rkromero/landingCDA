"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import type { Lead } from "@/lib/types"
import { ESTADOS_LEAD, COLORES_ESTADO } from "@/lib/constants"

interface LeadsTableProps {
  leads: Lead[]
  onViewLead: (lead: Lead) => void
  onEditLead: (lead: Lead) => void
  onDeleteLead: (leadId: string) => void
}

export function LeadsTable({ leads, onViewLead, onEditLead, onDeleteLead }: LeadsTableProps) {
  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">
                {lead.nombre} {lead.apellido}
              </TableCell>
              <TableCell>{lead.empresa}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.telefono}</TableCell>
              <TableCell>
                <Badge className={COLORES_ESTADO[lead.estado]} variant="secondary">
                  {ESTADOS_LEAD[lead.estado]}
                </Badge>
              </TableCell>
              <TableCell>{new Date(lead.fechaCreacion).toLocaleDateString("es-AR")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onViewLead(lead)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onEditLead(lead)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteLead(lead.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {leads.length === 0 && <div className="text-center py-8 text-gray-500">No se encontraron leads</div>}
    </div>
  )
}
