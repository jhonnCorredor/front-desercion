"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Cookies from "js-cookie"
import { Service } from "@/data/api"
import { Link } from "react-router-dom"

export default function SignIn() {
  const [correo, setEmail] = useState("")
  const [contrasena, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState(null)

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const response = await Service.post("/login/", { correo, contrasena })
      setNotification({
        type: "success",
        message: "Inicio de sesión exitoso. Redirigiendo...",
      })
      Cookies.set("menu", JSON.stringify(response.vistas_rol), { expires: 1 })
      Cookies.set("user", response.usuario_id, { expires: 1 })
      Cookies.set("rol", response.nombre_rol, {expires: 1})
      setTimeout(() => {
        window.location.href = "/dashboard/home"
      }, 1000)
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setNotification({
        type: "error",
        message: "Error al iniciar sesión. Por favor, verifica tus credenciales.",
      })
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="w-full lg:w-[480px] p-8 flex items-center justify-center bg-white">
        <div className="w-full max-w-[380px] space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <img src="/public/img/logoSena.jpg" alt="Logo" className="h-12 w-12 rounded-full" />
            <span className="text-2xl font-bold text-green-600">AutoGestion CIES</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
            <p className="text-sm text-gray-600">Ingresa tus credenciales para acceder a tu cuenta.</p>
          </div>

          {notification && (
            <Alert variant={notification.type === "success" ? "default" : "destructive"}>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Tu email o usuario"
                  value={correo}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={contrasena}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">¿No tienes una cuenta? </span>
            <Link to="/auth/sign-up" className="font-medium text-green-600 hover:text-green-800 transition-colors">
              Regístrate aquí
            </Link>
          </div>

          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <Link to="/soporte" className="hover:underline hover:text-gray-700 transition-colors">
              Soporte
            </Link>
            <Link to="/terminos" className="hover:underline hover:text-gray-700 transition-colors">
              Términos de Uso
            </Link>
            <Link to="/privacidad" className="hover:underline hover:text-gray-700 transition-colors">
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

