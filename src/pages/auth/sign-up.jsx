"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, User, FileText, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"
import { Service } from "@/data/api"

export function SignUp() {
  const [formData, setFormData] = useState({
    correo: "",
    nombres: "",
    apellidos: "",
    documento: "",
    tipoDocumento: "",
    contrasena: "",
  })
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!aceptaTerminos) {
      setNotification({
        type: "error",
        message: "Debes aceptar los términos y condiciones para registrarte.",
      })
      return
    }
    try {
      const response = await Service.post("/usuario/", {
        ...formData,
      })
      console.log("Registro exitoso:", response)
      setNotification({
        type: "success",
        message: "Registro exitoso. Por favor, inicia sesión.",
      })
      setTimeout(() => {
        window.location.href = "/auth/sign-in"
      }, 1000)
    } catch (error) {
      console.error("Error al registrarse:", error)
      setNotification({
        type: "error",
        message: "Error al registrarse. Por favor, intenta de nuevo.",
      })
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Registration form */}
      <div className="w-full lg:w-[580px] p-8 flex items-center justify-center bg-white">
        <div className="w-full max-w-[480px] space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <img src="/public/img/logoSena.jpg" alt="Logo SENA" className="h-12 w-12" />
            <span className="text-2xl font-bold text-green-600">AutoGestion CIES</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Crear Cuenta</h1>
            <p className="text-sm text-gray-600">Ingresa tus datos para registrarte en la plataforma.</p>
          </div>

          {notification && (
            <Alert variant={notification.type === "success" ? "default" : "destructive"}>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  value={formData.correo}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="nombres"
                    placeholder="Nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    name="apellidos"
                    placeholder="Apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onValueChange={(value) => setFormData({ ...formData, tipoDocumento: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Cédula de ciudadanía</SelectItem>
                  <SelectItem value="2">Tarjeta de identidad</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  name="documento"
                  placeholder="Número de documento"
                  value={formData.documento}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="contrasena"
                  placeholder="Contraseña"
                  value={formData.contrasena}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="rounded border-gray-300 text-green-600"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Acepto los{" "}
                <a href="#" className="text-green-600 hover:underline">
                  términos y condiciones
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Crear Cuenta
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/auth/sign-in" className="text-green-600 hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Background with image and overlay */}
      <div className="hidden lg:block lg:w-[calc(100%-480px)] relative overflow-hidden">
        <img
          src="/public/img/pexels-photo-924824.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Welcome text */}
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

export default SignUp

