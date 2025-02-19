"use client"

import { useState } from "react"
import { Mail, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Service } from "@/data/api"
import { Link } from "react-router-dom"

export default function ForgotPassword() {
  const [correo, setEmail] = useState("")
  const [notification, setNotification] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Service.post("/recuperarcontrasena/enviar-codigo/", { correo })
      if (!response) {
        throw new Error("La respuesta del backend es inválida")
      }

      const user = response.usuario_id
      console.log("Data de User:", user)

      const expirationDate = new Date()
      expirationDate.setTime(expirationDate.getTime() + 1 * 60 * 60 * 1000)
      document.cookie = `user_id=${user}; expires=${expirationDate.toUTCString()}; path=/`

      setNotification({
        type: "success",
        message: "Se ha enviado un código de recuperación a tu correo.",
      })
      setTimeout(() => {
        window.location.href = "/auth/reset-password"
      }, 1000)
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error)
      setNotification({
        type: "error",
        message: "Error al enviar el correo. Por favor, intenta de nuevo.",
      })
    }
  }

  return (
    <div className="flex min-h-screen">

      <div className="w-full lg:w-[480px] p-8 flex flex-col bg-white">
        <Link
          to="/auth/sign-in"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a inicio de sesión
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-[380px] mx-auto w-full space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <img src="/public/img/logoSena.jpg" alt="Logo" className="h-12 w-12 rounded-full" />
            <span className="text-2xl font-bold text-green-600">AutoGestion CIES</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Recuperar Contraseña</h1>
            <p className="text-sm text-gray-600">
              Ingresa tu correo electrónico para recibir un código de recuperación.
            </p>
          </div>

          {notification && (
            <Alert variant={notification.type === "success" ? "default" : "destructive"}>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={correo}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Enviar Código
            </Button>
          </form>

          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <Link href="/soporte" className="hover:underline hover:text-gray-700 transition-colors">
              Soporte
            </Link>
            <Link href="/terminos" className="hover:underline hover:text-gray-700 transition-colors">
              Términos de Uso
            </Link>
            <Link href="/privacidad" className="hover:underline hover:text-gray-700 transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Background image */}
      <div className="hidden lg:block lg:w-[calc(100%-480px)] relative overflow-hidden">
        <img
          src="/public/img/pexels-photo-924824.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 to-green-800/80 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Bienvenido a AutoGestion CIES</h2>
            <p className="text-xl">Tu plataforma de gestión educativa</p>
          </div>
        </div>
      </div>
    </div>
  )
}

