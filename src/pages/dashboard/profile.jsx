"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Button,
  Input,
  Switch,
  Textarea,
  IconButton,
} from "@material-tailwind/react"
import { UserIcon, EnvelopeIcon, IdentificationIcon, LockClosedIcon, CameraIcon } from "@heroicons/react/24/solid"
import Cookies from "js-cookie"
import { Service } from "@/data/api"
import { ConfirmationModal } from "./ConfirmationModal"

export function Profile() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    correo: "",
    contrasena: "",
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const userId = Cookies.get("user")
      if (!userId) {
        setError("No se encontró el usuario en las cookies.")
        setIsLoading(false)
        return
      }

      try {
        const response = await Service.get(`/usuario/${userId}/`)
        setUser(response)
        setEditedUser(response)
        setIsLoading(false)
      } catch (error) {
        setError("Error al cargar los datos del usuario.")
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleEdit = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditedUser({ ...user })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
     const response = await Service.put(`/usuario/${user.id}/`, editedUser, {
estado : false,
      })
console.log(response + " success");

      setUser(response)
      setIsEditing(false)
    } catch (error) {
      setError("Error al guardar los cambios.")
    }
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const handleAvatarChange = (e) => {
    console.log("Cambiar avatar", e.target.files[0])
  }

  const handleSendCode = () => {
    setIsModalOpen(true)
  }

  const handleConfirmCode = async (code) => {
    try {
      await Service.post("/verify-confirmation-code", { userId: user.id, code })
      setIsModalOpen(false)
    } catch (error) {
      setError("Código de confirmación incorrecto.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 text-red-500 text-xl">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 mt-6 lg:px-8 bg-gradient-to-br from-blue-gray-50 mt-12 rounded-xl min-h-screen via-white to-white">
      <Card className="mx-auto max-w-6xl shadow-xl">
        <CardHeader floated={false} className="h-80 bg-gradient-to-r black">
          <div className="absolute inset-0 h-full w-full bg-black/50" />
          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <div className="relative mb-4">
              <Avatar
                size="xxl"
                variant="circular"
                src="/img/bruce-mars.jpeg"
                alt={user?.nombres}
                className="border-4 border-white h-40 w-40 shadow-lg"
              />
              {isEditing && (
                <IconButton
                  color="blue"
                  variant="text"
                  size="sm"
                  className="!absolute bottom-0 right-0 rounded-full bg-blue-500 text-white"
                >
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <CameraIcon className="h-6 w-6" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </IconButton>
              )}
            </div>
            <Typography variant="h3" color="white" className="mb-2">
              {`${user?.nombres} ${user?.apellidos}`}
            </Typography>
            <Typography variant="lead" color="white" className="opacity-80">
              {user?.correo}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          <div className="flex justify-between items-center mb-8">
            <Typography variant="h4" color="blue-gray">
              Información Personal
            </Typography>
            <div className="flex items-center gap-2">
              <Typography variant="small" color="gray">
                Modo de edición
              </Typography>
              <Switch color="blue" checked={isEditing} onChange={handleEdit} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Datos Personales
              </Typography>
              <div className="space-y-4">
                <Input
                  icon={<UserIcon className="h-5 w-5" />}
                  value={editedUser?.nombres}
                  onChange={handleChange}
                  name="nombres"
                  label="Nombres"
                  readOnly={!isEditing}
                  color="blue"
                />
                <Input
                  icon={<UserIcon className="h-5 w-5" />}
                  value={editedUser?.apellidos}
                  onChange={handleChange}
                  name="apellidos"
                  label="Apellidos"
                  readOnly={!isEditing}
                  color="blue"
                />
                <Input
                  icon={<IdentificationIcon className="h-5 w-5" />}
                  value={editedUser?.documento}
                  onChange={handleChange}
                  name="documento"
                  label="Documento"
                  readOnly={!isEditing}
                  color="blue"
                />
                <Input
                  icon={<EnvelopeIcon className="h-5 w-5" />}
                  value={editedUser?.correo}
                  onChange={handleChange}
                  name="correo"
                  label="Correo"
                  readOnly={!isEditing}
                  color="blue"
                />
                {isEditing && (
                  <div className="space-y-2">
                    <Input
                      icon={<LockClosedIcon className="h-5 w-5" />}
                      type="password"
                      value={editedUser?.contrasena}
                      onChange={handleChange}
                      name="contrasena"
                      label="Contraseña"
                      color="blue"
                    />
                    <Button color="blue" variant="outlined" fullWidth onClick={handleSendCode}>
                      Enviar Código
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Biografía
              </Typography>
              <Textarea
                value={editedUser?.biografia}
                onChange={handleChange}
                name="biografia"
                label="Cuéntanos sobre ti"
                readOnly={!isEditing}
                rows={5}
                color="blue"
              />
              <Typography variant="h6" color="blue-gray" className="mt-8 mb-4">
                Permisos
              </Typography>
              <div className="space-y-4"></div>
            </div>
          </div>
          {isEditing && (
            <div className="flex justify-end gap-4 mt-8">
              <Button color="red" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button color="blue" onClick={handleSave}>
                Guardar Cambios
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmCode} />
    </div>
  )
}

export default Profile

