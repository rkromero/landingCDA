import type { Lead, User, Configuracion, Reporte } from "./types"

class DataStore {
  private storageKey = "b2b-lead-management"

  private getStoredData() {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : null
  }

  private setStoredData(data: any) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  private initializeData() {
    const existingData = this.getStoredData()
    if (!existingData) {
      const initialData = {
        leads: [] as Lead[],
        users: [
          {
            id: "1",
            email: "admin@alfajorcovers.com",
            nombre: "Administrador",
            rol: "admin" as const,
            fechaCreacion: new Date().toISOString(),
          },
        ] as User[],
        configuracion: {
          id: "1",
          nombreEmpresa: "Alfajor Covers Pro",
          colorPrimario: "#6C47FF",
          emailNotificaciones: "admin@alfajorcovers.com",
          mensajeBienvenida: "Gracias por tu interés en nuestras tapas para alfajores",
          camposPersonalizados: [],
        } as Configuracion,
      }
      this.setStoredData(initialData)
      return initialData
    }
    return existingData
  }

  // Lead operations
  getLeads(): Lead[] {
    const data = this.initializeData()
    return data.leads || []
  }

  addLead(lead: Omit<Lead, "id" | "fechaCreacion" | "fechaActualizacion">): Lead {
    const data = this.initializeData()
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      notas: [],
      archivos: [],
    }
    data.leads.push(newLead)
    this.setStoredData(data)
    return newLead
  }

  updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const data = this.initializeData()
    const leadIndex = data.leads.findIndex((lead: Lead) => lead.id === id)
    if (leadIndex === -1) return null

    data.leads[leadIndex] = {
      ...data.leads[leadIndex],
      ...updates,
      fechaActualizacion: new Date().toISOString(),
    }
    this.setStoredData(data)
    return data.leads[leadIndex]
  }

  deleteLead(id: string): boolean {
    const data = this.initializeData()
    const initialLength = data.leads.length
    data.leads = data.leads.filter((lead: Lead) => lead.id !== id)
    this.setStoredData(data)
    return data.leads.length < initialLength
  }

  // Configuration operations
  getConfiguracion(): Configuracion {
    const data = this.initializeData()
    return data.configuracion
  }

  updateConfiguracion(updates: Partial<Configuracion>): Configuracion {
    const data = this.initializeData()
    data.configuracion = { ...data.configuracion, ...updates }
    this.setStoredData(data)
    return data.configuracion
  }

  // Reporting
  getReporte(): Reporte {
    const leads = this.getLeads()
    const totalLeads = leads.length

    const leadsPorEstado = leads.reduce(
      (acc, lead) => {
        acc[lead.estado] = (acc[lead.estado] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const leadsGanados = leadsPorEstado.ganado || 0
    const conversionRate = totalLeads > 0 ? (leadsGanados / totalLeads) * 100 : 0

    const valorTotalGanado = leads
      .filter((lead) => lead.estado === "ganado" && lead.valorEstimado)
      .reduce((sum, lead) => sum + (lead.valorEstimado || 0), 0)

    const mesActual = new Date().getMonth()
    const añoActual = new Date().getFullYear()
    const leadsMesActual = leads.filter((lead) => {
      const fechaLead = new Date(lead.fechaCreacion)
      return fechaLead.getMonth() === mesActual && fechaLead.getFullYear() === añoActual
    }).length

    return {
      totalLeads,
      leadsPorEstado,
      conversionRate,
      valorTotalGanado,
      leadsMesActual,
      crecimientoMensual: 0, // Simplified for now
    }
  }
}

export const dataStore = new DataStore()
