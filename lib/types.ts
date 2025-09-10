export interface Lead {
  id: string
  nombre: string
  apellido: string
  empresa: string
  email: string
  telefono: string
  mensaje: string
  estado: "entrante" | "contactado" | "evaluando" | "ganado" | "perdido"
  fechaCreacion: string
  fechaActualizacion: string
  notas: string[]
  archivos: string[]
  valorEstimado?: number
  fechaCierre?: string
}

export interface User {
  id: string
  email: string
  nombre: string
  rol: "admin" | "vendedor"
  fechaCreacion: string
}

export interface Configuracion {
  id: string
  nombreEmpresa: string
  colorPrimario: string
  logo?: string
  emailNotificaciones: string
  mensajeBienvenida: string
  camposPersonalizados: CampoPersonalizado[]
}

export interface CampoPersonalizado {
  id: string
  nombre: string
  tipo: "texto" | "numero" | "fecha" | "seleccion"
  opciones?: string[]
  requerido: boolean
}

export interface Reporte {
  totalLeads: number
  leadsPorEstado: Record<string, number>
  conversionRate: number
  valorTotalGanado: number
  leadsMesActual: number
  crecimientoMensual: number
}
