"use client"

import { useState } from "react"
import { Lock, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Service } from "@/data/api"
import Cookies from "js-cookie"
import { Link } from "react-router-dom"

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    codigo: "",
  })
  const [updateData, setUpdateData] = useState({
    contrasena: "",
    confirmPassword: "",
  })
  const [codeVerified, setCodeVerified] = useState(false)
  const [notification, setNotification] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (!codeVerified) {
      setFormData({ ...formData, [name]: value })
    } else {
      setUpdateData({ ...updateData, [name]: value })
    }
  }

  const verifyCode = async (e) => {
    e.preventDefault()

    const user_id = Cookies.get("user_id")
    if (!user_id) {
      showNotification("error", "No se encontró el usuario en las cookies.")
      return
    }
    try {
      await Service.post(`/recuperarcontrasena/verificar-codigo/`, {
        codigo: formData.codigo,
        usuario_id: user_id,
      })
      setCodeVerified(true)
      showNotification("success", "Código válido. Ingresa tu nueva contraseña.")
    } catch (error) {
      console.error("Error al verificar el código:", error)
      showNotification("error", "Código inválido. Por favor, intenta de nuevo.")
    }
  }

  const updatePassword = async (e) => {
    e.preventDefault()

    if (updateData.contrasena !== updateData.confirmPassword) {
      showNotification("error", "Las contraseñas no coinciden.")
      return
    }
    const user_id = Cookies.get("user_id")
    if (!user_id) {
      showNotification("error", "No se encontró el usuario en las cookies.")
      return
    }
    try {
      await Service.patch(`/usuario/${user_id}/`, {
        contrasena: updateData.contrasena,
      })
      showNotification("success", "Contraseña actualizada exitosamente.")
      setTimeout(() => {
        window.location.href = "/auth/sign-in"
      }, 2000)
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error)
      showNotification("error", "Error al actualizar la contraseña. Por favor, intenta de nuevo.")
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Reset password form */}
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
            <h1 className="text-3xl font-bold text-gray-800">
              {codeVerified ? "Actualizar Contraseña" : "Verificar Código"}
            </h1>
            <p className="text-sm text-gray-600">
              {codeVerified ? "Ingresa tu nueva contraseña." : "Ingresa el código de recuperación que recibiste."}
            </p>
          </div>

          {notification && (
            <Alert variant={notification.type === "success" ? "default" : "destructive"}>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={codeVerified ? updatePassword : verifyCode} className="space-y-6">
            {!codeVerified ? (
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Código de recuperación"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    className="pl-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Nueva contraseña"
                    name="contrasena"
                    value={updateData.contrasena}
                    onChange={handleChange}
                    className="pl-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Confirmar nueva contraseña"
                    name="confirmPassword"
                    value={updateData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              {codeVerified ? "Actualizar Contraseña" : "Verificar Código"}
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

