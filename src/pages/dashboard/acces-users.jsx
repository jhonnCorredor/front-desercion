"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react"
import { Button } from "@/components/ui/button"
import DataTableComponent from "@/widgets/datatable/data-table"
import { Service } from "@/data/api"
import { CheckIcon, UserCircleIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Swal from "sweetalert2"

export function AccesUser() {
  const [data, setData] = useState([])
  const [roles, setRoles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null) 

  const fetchData = async () => {
    setIsLoading(true)
    setError(null) 
    try {
      const response = await Service.get("/usuario/usuario_sin_rol/")
      setData(response || [])
    } catch (error) {
      console.error("Error al obtener los usuarios:", error)
      setError("Error al obtener los usuarios. Por favor, inténtalo de nuevo más tarde.") 
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await Service.get("/rol/")
      setRoles(response || [])
    } catch (error) {
      console.error("Error al obtener los roles: ", error)
      setRoles([])
    }
  }

  useEffect(() => {
    fetchRoles()
    fetchData()
  }, [])

  const handleAction = (row) => {
    setSelectedRow(row)
    setShowModal(true)
  }

  const handleRoleChange = (value) => {
    setSelectedRole(value)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedRole("")
  }

  const accesUser = async () => {
    try {
      const DataAcces = {
        estado: true,
        usuario_id: selectedRow.id,
        rol_id: selectedRole,
      }

      await Service.post("/usuariorol/", DataAcces)
      Swal.fire({
                  title: "Usuario autorizado",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
              })
      setSelectedRow(null)
      setSelectedRole("")
      await fetchData()
      handleCloseModal()
    } catch (error) {
      console.error("Error al autorizar el usuario: ", error)
      setError("Error al autorizar el usuario. Por favor, inténtalo de nuevo más tarde.") // Set error message
    }
  }

  const columns = [
    {
      name: "id",
      selector: (row) => row.id,
      sortable: true,
      omit: true,
    },
    {
      name: "nombres",
      selector: (row) => row.nombres + " " + row.apellidos,
      sortable: true,
    },
    {
      name: "correo",
      selector: (row) => row.correo,
      sortable: true,
    },
    {
        name: "tipo de documento",
        selector: (row) => row.tipoDocumento_nombre,
        sortable: true,
      },
    {
      name: "documento",
      selector: (row) => row.documento,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <Button variant="outline" size="sm" className="flex bg-green-500 text-white hover:bg-green-500 hover:bg-opacity-80 items-center gap-2"  onClick={() => handleAction(row)}>
          <CheckIcon className="h-4 w-4" />
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ]

  return (
    
    <div className="mt-6 mb-8 space-y-6 bg-gradient-to-br from-blue-gray-50 mt-12 rounded-xl min-h-screen via-white to-white">
      <Card className="bg-gradient-to-br from-blue-gray-50 rounded-xl min-h-screen via-white to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Acceso de usuarios</CardTitle>
        </CardHeader>
        <CardContent>
        <DataTableComponent
          columns={columns}
          data={data}
          loading={isLoading}
          error={error} />{" "}
        {/* Pass error state to DataTableComponent */}
      </CardContent>
    </Card><Dialog open={showModal} handler={handleCloseModal} size="xs">
        <DialogHeader className="justify-center">
          <Typography variant="h5" color="blue-gray">
            Autorizar Usuario
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <UserCircleIcon className="w-20 h-20 text-blue-500" />
          <Typography color="blue-gray" variant="h4">
            {selectedRow?.nombres} {selectedRow?.apellidos}
          </Typography>
          <Typography className="text-center font-normal" color="gray">
            Asigne un rol al usuario para autorizar su acceso al sistema.
          </Typography>
          <Select label="Seleccione un rol" value={selectedRole} onChange={handleRoleChange} className="w-full">
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.nombre}
              </Option>
            ))}
          </Select>
        </DialogBody>
        <DialogFooter className="space-x-2 justify-center">
          <Button variant="outlined" color="red" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="gradient" color="green" onClick={accesUser} disabled={!selectedRole}>
            Autorizar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default AccesUser

