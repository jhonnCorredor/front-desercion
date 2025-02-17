"use client";

import { useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { Service } from "@/data/api";
import Cookies from "js-cookie";

export function ResetPassword() {
  const [formData, setFormData] = useState({
    codigo: "",
  });
  const [updateData, setUpdateData] = useState({
    contrasena: "",
    confirmPassword: "",
  });
  const [codeVerified, setCodeVerified] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!codeVerified) {
      setFormData({ ...formData, [name]: value });
    } else {
      setUpdateData({ ...updateData, [name]: value });
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();

    const user_id = Cookies.get("user_id");
    if (!user_id) {
      showNotification("red", "No se encontró el usuario en las cookies.");
      return;
    }
    try {
      await Service.post(`/recuperarcontrasena/verificar-codigo/`, {
        codigo: formData.codigo,
        usuario_id: user_id
      });
      setCodeVerified(true);
      showNotification("green", "Código válido. Ingresa tu nueva contraseña.");
    } catch (error) {
      console.error("Error al verificar el código:", error);
      showNotification("red", "Código inválido. Por favor, intenta de nuevo.");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (updateData.newPassword !== updateData.confirmPassword) {
      showNotification("red", "Las contraseñas no coinciden.");
      return;
    }
    const user_id = Cookies.get("user_id");
    if (!user_id) {
      showNotification("red", "No se encontró el usuario en las cookies.");
      return;
    }
    try {
      await Service.patch(`/usuario/${user_id}/`, {
        contrasena: updateData.newPassword,
      });
      showNotification("green", "Contraseña actualizada exitosamente.");
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      showNotification("red", "Error al actualizar la contraseña. Por favor, intenta de nuevo.");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4 shadow-xl">
        {!codeVerified ? (
          // Formulario de verificación del código
          <form onSubmit={verifyCode} className="p-8">
            <div className="text-center mb-8">
              <LockClosedIcon className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <Typography variant="h3" className="font-bold text-2xl mb-2">
                Verificar Código
              </Typography>
              <Typography variant="paragraph" color="blue-gray" className="text-sm">
                Ingresa el código de recuperación que recibiste.
              </Typography>
            </div>
            <div className="mb-4 space-y-4">
              <Input
                size="lg"
                label="Código de recuperación"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="mt-6" fullWidth>
              Verificar Código
            </Button>
          </form>
        ) : (
          // Formulario de actualización de contraseña (solo se muestra si el código es correcto)
          <form onSubmit={updatePassword} className="p-8">
            <div className="text-center mb-8">
              <LockClosedIcon className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <Typography variant="h3" className="font-bold text-2xl mb-2">
                Actualizar Contraseña
              </Typography>
              <Typography variant="paragraph" color="blue-gray" className="text-sm">
                Ingresa tu nueva contraseña.
              </Typography>
            </div>
            <div className="mb-4 space-y-4">
              <Input
                type="password"
                size="lg"
                label="Nueva contraseña"
                name="newPassword"
                value={updateData.newPassword}
                onChange={handleChange}
                required
              />
              <Input
                type="password"
                size="lg"
                label="Confirmar nueva contraseña"
                name="confirmPassword"
                value={updateData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="mt-6" fullWidth>
              Actualizar Contraseña
            </Button>
          </form>
        )}
      </Card>
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-white ${
            notification.type === "green" ? "bg-green-500" : "bg-red-500"
          } transition-opacity duration-500 ${notification ? "opacity-100" : "opacity-0"}`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
