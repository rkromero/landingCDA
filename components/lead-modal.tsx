"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Lead } from "@/lib/types"
import { ESTADOS_LEAD, COLORES_ESTADO } from "@/lib/constants"
import { dataStore } from "@/lib/data-store"

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  lead: Lead | null
  mode: "view" | "edit" | "create"
  onSave: () => void
}

export function LeadModal({ isOpen, onClose, lead, mode, onSave }: LeadModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
    mensaje: "",
    estado: "entrante" as Lead["estado"],
    valorEstimado: "",
  })

  useEffect(() => {
    if (lead) {
      setFormData({
        nombre: lead.nombre,
        apellido: lead.apellido,
        empresa: lead.empresa,
        email: lead.email,
        telefono: lead.telefono,
        mensaje: lead.mensaje,
        estado: lead.estado,
        valorEstimado: lead.valorEstimado?.toString() || "",
      })
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        empresa: "",
        email: "",
        telefono: "",
        mensaje: "",
        estado: "entrante",
        valorEstimado: "",
      })
    }
  }, [lead, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const leadData = {
      ...formData,
      valorEstimado: formData.valorEstimado ? Number.parseFloat(formData.valorEstimado) : undefined,
    }

    if (mode === "create") {
      dataStore.addLead(leadData)
    } else if (mode === "edit" && lead) {
      dataStore.updateLead(lead.id, leadData)
    }

    onSave()
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Crear Nuevo Lead"}
            {mode === "edit" && "Editar Lead"}
            {mode === "view" && "Detalles del Lead"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Completa la información del nuevo lead"}
            {mode === "edit" && "Modifica la información del lead"}
            {mode === "view" && "Información detallada del lead"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                readOnly={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa *</Label>
            <Input
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleInputChange}
              required
              readOnly={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                readOnly={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              {isReadOnly ? (
                <div>
                  <Badge className={COLORES_ESTADO[formData.estado]} variant="secondary">
                    {ESTADOS_LEAD[formData.estado]}
                  </Badge>
                </div>
              ) : (
                <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ESTADOS_LEAD).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorEstimado">Valor Estimado (ARS)</Label>
              <Input
                id="valorEstimado"
                name="valorEstimado"
                type="number"
                value={formData.valorEstimado}
                onChange={handleInputChange}
                placeholder="0"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensaje">Mensaje</Label>
            <Textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleInputChange}
              rows={4}
              readOnly={isReadOnly}
            />
          </div>

          {lead && mode === "view" && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="text-sm font-medium text-gray-600">Fecha de Creación</Label>
                <p className="text-sm">{new Date(lead.fechaCreacion).toLocaleString("es-AR")}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Última Actualización</Label>
                <p className="text-sm">{new Date(lead.fechaActualizacion).toLocaleString("es-AR")}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isReadOnly ? "Cerrar" : "Cancelar"}
            </Button>
            {!isReadOnly && (
              <Button type="submit" className="bg-[#6C47FF] hover:bg-[#5A3AD1]">
                {mode === "create" ? "Crear Lead" : "Guardar Cambios"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
