"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Shield, Truck, Clock, Award, Phone, Mail, MapPin } from "lucide-react"
import { dataStore } from "@/lib/data-store"

export default function LandingPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
    mensaje: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Add lead to data store
      dataStore.addLead({
        ...formData,
        estado: "entrante",
      })

      setIsSubmitted(true)
      setFormData({
        nombre: "",
        apellido: "",
        empresa: "",
        email: "",
        telefono: "",
        mensaje: "",
      })
    } catch (error) {
      console.error("Error al enviar formulario:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">¡Gracias por contactarnos!</CardTitle>
            <CardDescription className="text-lg">
              Hemos recibido tu consulta y nos pondremos en contacto contigo pronto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#6C47FF] hover:bg-[#5A3AD1] text-white w-full h-12"
            >
              Enviar otra consulta
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-7 h-7 sm:w-8 sm:h-8 text-[#6C47FF]" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Alfajor Covers Pro</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>+54 11 4567-8900</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>ventas@alfajorcovers.com</span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="h-9 px-3 text-sm bg-transparent">
                <a href="/admin">Admin</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-br from-purple-50 to-indigo-100 py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url('/tapas-de-alfajores-argentinos-cacao-maicena-vainil.jpg')`,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="mb-3 sm:mb-4 bg-[#6C47FF] text-white text-xs sm:text-sm px-3 py-1">
              ✨ Oferta Especial - Descuento del 15% en tu primer pedido
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 text-balance leading-tight">
              Aumenta tus Ventas con
              <span className="text-[#6C47FF]"> Tapas Premium</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto text-pretty mb-6 sm:mb-8 px-2">
              Las tapas que hacen que tus alfajores se vendan solos. Calidad industrial, diseños atractivos y precios
              que mejoran tu margen de ganancia.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span>Entrega en 48-72hs</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span>Mínimo 1000 unidades</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span>Garantía de calidad</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6C47FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Calidad Certificada ISO 9001</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Materiales aprobados por ANMAT que mantienen la frescura hasta 6 meses. Tus clientes notarán la
                    diferencia.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6C47FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Producción Express</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    De 1,000 a 100,000 unidades listas en 48-72 horas. Nunca más te quedarás sin stock.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6C47FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Envío Gratis en CABA y GBA</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Logística refrigerada especializada. Resto del país con tarifas preferenciales.
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="font-semibold text-green-800 text-sm sm:text-base">Garantía Total</span>
                </div>
                <p className="text-green-700 text-xs sm:text-sm">
                  Si no estás 100% satisfecho, te devolvemos tu dinero. Sin preguntas.
                </p>
              </div>
            </div>

            <Card className="w-full shadow-2xl border-2 border-[#6C47FF]/20 order-1 lg:order-2">
              <CardHeader className="bg-gradient-to-r from-[#6C47FF] to-[#5A3AD1] text-white rounded-t-lg p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl text-center">🎯 Cotización Inmediata</CardTitle>
                <CardDescription className="text-center text-purple-100 text-sm sm:text-base">
                  Respuesta en menos de 2 horas hábiles
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-sm font-medium">
                        Nombre *
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Tu nombre"
                        className="border-2 focus:border-[#6C47FF] h-11 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido" className="text-sm font-medium">
                        Apellido *
                      </Label>
                      <Input
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                        placeholder="Tu apellido"
                        className="border-2 focus:border-[#6C47FF] h-11 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa" className="text-sm font-medium">
                      Empresa *
                    </Label>
                    <Input
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      required
                      placeholder="Nombre de tu empresa"
                      className="border-2 focus:border-[#6C47FF] h-11 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="tu@empresa.com"
                      className="border-2 focus:border-[#6C47FF] h-11 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-sm font-medium">
                      WhatsApp *
                    </Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      placeholder="+54 9 11 1234-5678"
                      className="border-2 focus:border-[#6C47FF] h-11 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje" className="text-sm font-medium">
                      ¿Cuántas tapas necesitas mensualmente?
                    </Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      placeholder="Ej: 10,000 tapas mensuales para alfajores de dulce de leche..."
                      rows={3}
                      className="border-2 focus:border-[#6C47FF] text-base resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#6C47FF] to-[#5A3AD1] hover:from-[#5A3AD1] hover:to-[#4A2FB8] text-white text-base sm:text-lg py-4 sm:py-6 font-semibold h-12 sm:h-14"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "🚀 Obtener Cotización Gratis"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    * Campos obligatorios. No spam, solo información valiosa.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Nuestras Variedades Premium</h3>
            <p className="text-lg sm:text-xl text-gray-600">4 sabores únicos que harán irresistibles tus alfajores</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow border-2 hover:border-[#6C47FF]/30">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-600 rounded-full"></div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Cacao</h4>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Sabor clásico y equilibrado. Perfecto para alfajores tradicionales que buscan ese toque de chocolate
                suave.
              </p>
              <Badge className="bg-amber-100 text-amber-800 text-xs">Más Popular</Badge>
            </Card>

            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow border-2 hover:border-[#6C47FF]/30">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-full"></div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Maicena</h4>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Textura delicada y sabor neutro. Ideal para resaltar el relleno sin competir con los sabores internos.
              </p>
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">Clásico</Badge>
            </Card>

            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow border-2 hover:border-[#6C47FF]/30">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-400 rounded-full"></div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Vainilla</h4>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Aroma dulce y envolvente. Aporta una nota aromática especial que complementa perfectamente el dulce de
                leche.
              </p>
              <Badge className="bg-orange-100 text-orange-800 text-xs">Aromático</Badge>
            </Card>

            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow border-2 hover:border-[#6C47FF]/30">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-full"></div>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Cacao Dark Intenso</h4>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Sabor profundo y sofisticado. Para alfajores gourmet que buscan una experiencia de chocolate premium.
              </p>
              <Badge className="bg-gray-100 text-gray-800 text-xs">Premium</Badge>
            </Card>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <div className="bg-[#6C47FF]/10 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">💡 ¿No sabes cuál elegir?</h4>
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                Nuestros expertos te ayudan a seleccionar la variedad perfecta según tu tipo de alfajor, target de
                mercado y objetivos de venta.
              </p>
              <Button
                className="bg-[#6C47FF] hover:bg-[#5A3AD1] text-white h-11 px-6 text-sm sm:text-base"
                onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Consultar con un Experto
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              ¿Por qué elegir nuestras tapas?
            </h3>
            <p className="text-lg sm:text-xl text-gray-600">Números que hablan por sí solos</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold text-[#6C47FF] mb-2">6 meses</div>
              <div className="text-sm sm:text-base text-gray-600">Vida útil garantizada</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold text-[#6C47FF] mb-2">48hs</div>
              <div className="text-sm sm:text-base text-gray-600">Tiempo de producción</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold text-[#6C47FF] mb-2">200+</div>
              <div className="text-sm sm:text-base text-gray-600">Empresas satisfechas</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-bold text-[#6C47FF] mb-2">99.8%</div>
              <div className="text-sm sm:text-base text-gray-600">Tasa de satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Preguntas Frecuentes</h3>
            <p className="text-lg sm:text-xl text-gray-600">Todo lo que necesitas saber</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">¿Cuál es el pedido mínimo?</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                El pedido mínimo es de 1,000 unidades. Ofrecemos descuentos por volumen a partir de 5,000 unidades.
              </p>
            </Card>

            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">¿Qué materiales utilizan?</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Utilizamos materiales aprobados por ANMAT, libres de BPA, que garantizan la conservación y frescura de
                tus alfajores.
              </p>
            </Card>

            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">¿Hacen diseños personalizados?</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Sí, ofrecemos diseños personalizados con tu marca. El costo adicional depende de la complejidad y
                cantidad.
              </p>
            </Card>

            <Card className="p-4 sm:p-6">
              <h4 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">¿Cómo es el proceso de pago?</h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Aceptamos transferencia bancaria, efectivo y tarjetas. Para clientes recurrentes ofrecemos términos de
                pago flexibles.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-r from-[#6C47FF] to-[#5A3AD1] text-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">¡Oferta por Tiempo Limitado!</h3>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6">
            15% de descuento en tu primer pedido + envío gratis en CABA y GBA
          </p>
          <div className="bg-white/20 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="text-lg sm:text-2xl font-bold mb-2">⏰ Esta oferta vence en:</div>
            <div className="text-2xl sm:text-3xl font-mono">7 días</div>
          </div>
          <Button
            size="lg"
            className="bg-white text-[#6C47FF] hover:bg-gray-100 text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 font-semibold h-12 sm:h-14 w-full sm:w-auto"
            onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}
          >
            🎯 Solicitar Cotización Ahora
          </Button>
          <p className="text-xs sm:text-sm mt-3 sm:mt-4 opacity-90">
            * Válido solo para nuevos clientes. No acumulable con otras promociones.
          </p>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#6C47FF]" />
                <span className="text-lg sm:text-xl font-bold">Alfajor Covers Pro</span>
              </div>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                Líderes en tapas premium para alfajores industriales en Argentina.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[#6C47FF]" />
                  <span className="text-xs sm:text-sm">ISO 9001</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[#6C47FF]" />
                  <span className="text-xs sm:text-sm">ANMAT</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Contacto</h4>
              <div className="space-y-2 text-gray-400 text-sm sm:text-base">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>+54 11 4567-8900</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>ventas@alfajorcovers.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Horarios</h4>
              <div className="text-gray-400 space-y-1 text-sm sm:text-base">
                <div>Lunes a Viernes: 8:00 - 18:00</div>
                <div>Sábados: 9:00 - 13:00</div>
                <div>Domingos: Cerrado</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-sm">&copy; 2024 Alfajor Covers Pro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
