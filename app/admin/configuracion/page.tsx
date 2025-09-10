"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, LogOut, Settings, Palette, Plus, Trash2, Save, Building, Bell } from "lucide-react"
import { dataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth"
import type { Configuracion, CampoPersonalizado } from "@/lib/types"

export default function ConfiguracionPage() {
  const { user, logout } = useAuth()
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [newField, setNewField] = useState<Partial<CampoPersonalizado>>({
    nombre: "",
    tipo: "texto",
    requerido: false,
    opciones: [],
  })

  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = () => {
    const configuracion = dataStore.getConfiguracion()
    setConfig(configuracion)
    setIsLoading(false)
  }

  const handleConfigChange = (field: keyof Configuracion, value: any) => {
    if (!config) return
    setConfig({ ...config, [field]: value })
  }

  const handleSaveConfig = async () => {
    if (!config) return

    setIsSaving(true)
    try {
      dataStore.updateConfiguracion(config)
      setSaveMessage("Configuración guardada exitosamente")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("Error al guardar la configuración")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddCustomField = () => {
    if (!config || !newField.nombre) return

    const field: CampoPersonalizado = {
      id: Date.now().toString(),
      nombre: newField.nombre,
      tipo: newField.tipo as "texto" | "numero" | "fecha" | "seleccion",
      requerido: newField.requerido || false,
      opciones: newField.tipo === "seleccion" ? newField.opciones : undefined,
    }

    const updatedConfig = {
      ...config,
      camposPersonalizados: [...config.camposPersonalizados, field],
    }

    setConfig(updatedConfig)
    setNewField({
      nombre: "",
      tipo: "texto",
      requerido: false,
      opciones: [],
    })
  }

  const handleRemoveCustomField = (fieldId: string) => {
    if (!config) return

    const updatedConfig = {
      ...config,
      camposPersonalizados: config.camposPersonalizados.filter((field) => field.id !== fieldId),
    }

    setConfig(updatedConfig)
  }

  const handleNewFieldChange = (field: string, value: any) => {
    setNewField((prev) => ({ ...prev, [field]: value }))
  }

  const addOption = () => {
    if (!newField.opciones) {
      setNewField((prev) => ({ ...prev, opciones: [""] }))
    } else {
      setNewField((prev) => ({
        ...prev,
        opciones: [...(prev.opciones || []), ""],
      }))
    }
  }

  const updateOption = (index: number, value: string) => {
    if (!newField.opciones) return
    const updatedOptions = [...newField.opciones]
    updatedOptions[index] = value
    setNewField((prev) => ({ ...prev, opciones: updatedOptions }))
  }

  const removeOption = (index: number) => {
    if (!newField.opciones) return
    const updatedOptions = newField.opciones.filter((_, i) => i !== index)
    setNewField((prev) => ({ ...prev, opciones: updatedOptions }))
  }

  if (isLoading || !config) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C47FF] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando configuración...</p>
          </div>
        </div>
      </AuthGuard>
    )
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
                  <h1 className="text-xl font-semibold text-gray-900">Configuración del Sistema</h1>
                  <p className="text-sm text-gray-500">Personaliza tu aplicación</p>
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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {saveMessage && (
            <Alert className="mb-6">
              <AlertDescription>{saveMessage}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">
                <Building className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="branding">
                <Palette className="w-4 h-4 mr-2" />
                Marca
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="fields">
                <Settings className="w-4 h-4 mr-2" />
                Campos
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                  <CardDescription>Configura la información básica de tu empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
                    <Input
                      id="nombreEmpresa"
                      value={config.nombreEmpresa}
                      onChange={(e) => handleConfigChange("nombreEmpresa", e.target.value)}
                      placeholder="Nombre de tu empresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensajeBienvenida">Mensaje de Bienvenida</Label>
                    <Textarea
                      id="mensajeBienvenida"
                      value={config.mensajeBienvenida}
                      onChange={(e) => handleConfigChange("mensajeBienvenida", e.target.value)}
                      placeholder="Mensaje que verán los usuarios después de enviar el formulario"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branding Settings */}
            <TabsContent value="branding">
              <Card>
                <CardHeader>
                  <CardTitle>Personalización de Marca</CardTitle>
                  <CardDescription>Personaliza los colores y apariencia de tu aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="colorPrimario">Color Primario</Label>
                    <div className="flex items-center space-x-3">
                      <Input
                        id="colorPrimario"
                        type="color"
                        value={config.colorPrimario}
                        onChange={(e) => handleConfigChange("colorPrimario", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={config.colorPrimario}
                        onChange={(e) => handleConfigChange("colorPrimario", e.target.value)}
                        placeholder="#6C47FF"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Este color se usará para botones, enlaces y elementos destacados
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Vista Previa</Label>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-3">
                        <Button style={{ backgroundColor: config.colorPrimario }} className="text-white">
                          Botón de Ejemplo
                        </Button>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: config.colorPrimario }}></div>
                          <span style={{ color: config.colorPrimario }}>Texto con color primario</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Notificaciones</CardTitle>
                  <CardDescription>Configura cómo y cuándo recibir notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailNotificaciones">Email para Notificaciones</Label>
                    <Input
                      id="emailNotificaciones"
                      type="email"
                      value={config.emailNotificaciones}
                      onChange={(e) => handleConfigChange("emailNotificaciones", e.target.value)}
                      placeholder="admin@tuempresa.com"
                    />
                    <p className="text-sm text-gray-500">Recibirás notificaciones de nuevos leads en este email</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Tipos de Notificaciones</h4>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Nuevos Leads</Label>
                        <p className="text-sm text-gray-500">Notificar cuando llegue un nuevo lead</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Cambios de Estado</Label>
                        <p className="text-sm text-gray-500">Notificar cuando un lead cambie de estado</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Resumen Semanal</Label>
                        <p className="text-sm text-gray-500">Recibir resumen semanal de actividad</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Fields Settings */}
            <TabsContent value="fields">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Campos Personalizados</CardTitle>
                    <CardDescription>Agrega campos adicionales al formulario de leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {config.camposPersonalizados.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{field.tipo}</Badge>
                            <div>
                              <p className="font-medium">{field.nombre}</p>
                              {field.requerido && <p className="text-sm text-gray-500">Campo requerido</p>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCustomField(field.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      {config.camposPersonalizados.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No hay campos personalizados configurados</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Agregar Nuevo Campo</CardTitle>
                    <CardDescription>Crea un nuevo campo personalizado para el formulario</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fieldName">Nombre del Campo</Label>
                        <Input
                          id="fieldName"
                          value={newField.nombre}
                          onChange={(e) => handleNewFieldChange("nombre", e.target.value)}
                          placeholder="Ej: Presupuesto estimado"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fieldType">Tipo de Campo</Label>
                        <Select value={newField.tipo} onValueChange={(value) => handleNewFieldChange("tipo", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="texto">Texto</SelectItem>
                            <SelectItem value="numero">Número</SelectItem>
                            <SelectItem value="fecha">Fecha</SelectItem>
                            <SelectItem value="seleccion">Selección</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {newField.tipo === "seleccion" && (
                      <div className="space-y-2">
                        <Label>Opciones</Label>
                        <div className="space-y-2">
                          {(newField.opciones || []).map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Opción ${index + 1}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(index)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={addOption}>
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Opción
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newField.requerido}
                        onCheckedChange={(checked) => handleNewFieldChange("requerido", checked)}
                      />
                      <Label>Campo requerido</Label>
                    </div>

                    <Button
                      onClick={handleAddCustomField}
                      disabled={!newField.nombre}
                      className="bg-[#6C47FF] hover:bg-[#5A3AD1]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Campo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button onClick={handleSaveConfig} disabled={isSaving} className="bg-[#6C47FF] hover:bg-[#5A3AD1]">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
