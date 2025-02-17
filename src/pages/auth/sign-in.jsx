"use client";

import { useState } from "react";
import { Card, Input, Checkbox, Button, Typography, Alert } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { Service } from "@/data/api";
import Cookies from "js-cookie";
export function SignIn() {
  const [correo, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const response = await Service.post("/login/", { correo, contrasena })
      setNotification({
        type: "green",
        message: "Inicio de sesión exitoso. Redirigiendo...",
      })
      Cookies.set("menu", JSON.stringify(response.vistas_rol), { expires: rememberMe ? 30 : 1 })
      Cookies.set("user", response.usuario_id, { expires: rememberMe ? 30 : 1 })
      setTimeout(() => {
        window.location.href = "/dashboard/home"
      }, 1000)
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setNotification({
        type: "red",
        message: "Error al iniciar sesión. Por favor, verifica tus credenciales.",
      })
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen" 
      style={{
        background: "slate-700",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
          >
      <Card className="w-full max-w-md p-8 shadow-lg rounded-lg border border-gray-300 bg-gray-50 " >
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="text-center">
            <Typography variant="h2" className="font-bold text-gray-800 text-3xl">
              Iniciar Sesión
            </Typography>
            <Typography variant="paragraph" className="mt-2 text-gray-600">
              Ingresa tu correo y contraseña para acceder.
            </Typography>
          </div>
          {notification && (
            <Alert
              color={notification.type === "success" ? "green" : "red"}
              dismissible={{
                onClose: () => setNotification(null),
              }}
              className="mb-4"
            >
              {notification.message}
            </Alert>
          )}
          <div>
            <Typography variant="small" className="mb-2 font-medium text-gray-700">
              Correo electrónico
            </Typography>
            <Input
              type="correo"
              value={correo}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
              fullWidth
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Typography variant="small" className="mb-2 font-medium text-gray-700">
              Contraseña
            </Typography>
            <Input
              type="contrasena"
              value={contrasena}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              fullWidth
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <Checkbox
              label="Recordarme"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="text-gray-700"
            />
            <Typography variant="small" className="font-medium text-blue-500">
              <Link to="/auth/forgot-password" className="mt-6">
                ¿Olvidaste tu contraseña?
              </Link>
            </Typography>
          </div>
          <Button
            type="submit"
            fullWidth
            className="mt-6"
          >
            Iniciar Sesión
          </Button>
          <div className="text-center">
            <Typography variant="small" className="text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link to="/auth/sign-up" className="text-blue-500 font-medium hover:underline">
                Regístrate
              </Link>
            </Typography>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SignIn;
