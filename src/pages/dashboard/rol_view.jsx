"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DataTableComponent from "@/widgets/datatable/data-table"
import { Service } from "@/data/api"
import { CheckIcon, PlusIcon, TrashIcon } from "lucide-react"
import { DynamicModal } from "@/widgets/Modal/DynamicModal"
import Swal from "sweetalert2"

export function TableRolView() {
  const [data, setData] = useState([])
  const [dataRol, setDataRol] = useState([])
  const [dataVista, setDataVista] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await Service.get("/rolvista/")
      setData(response || [])
    } catch (error) {
      console.error("Error al obtener los usuarios:", error)
      setError("Error al cargar los datos. Por favor, intente de nuevo más tarde.")
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchRol = async () => {
    try {
      const response = await Service.get("/rol/")

      setDataRol(response.map((item) => ({
        value: item.id,
        label: item.nombre,
      }))
      )
    } catch (error) {
      console.error("Error al obtener los roles:", error)
      setTipoDocumento([])
    }
  }

  const fetchVista = async () => {
    try {
        const response = await Service.get("/vistas/")
        setDataVista(response.map((item) => ({
            value: item.id,
            label: item.nombre,
            }))
            )
    } catch (error) {
        console.error("Error al obtener las vistas:", error)
        setTipoDocumento([])
    }
  }

  useEffect(() => {
    fetchData()
    fetchRol()
    fetchVista()
  }, [fetchData])

  const handleAction = (row) => {
    setSelectedRow(row)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRow(null)
  }
  
  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }


  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true)
      setError(null)
      if (selectedRow) {
        await Service.put(`/rolvista/${selectedRow.id}`, formData)
        Swal.fire({
                    title: "Ruta actualizada",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                })
      } else {
        await Service.post("/rolvista/", formData, {
estado : false,
        })
        Swal.fire({
                    title: "Ruta creada",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                })


      }
      await fetchData()
      handleCloseModal()
    } catch (error) {
        showNotification("red", "Error al enviar el correo. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false)
    }
  }

    const handleDelete = async (row) => {
      console.log(row)
      try {
          Swal.fire({
              title: "¿Estás seguro de eliminar este ruta?",
              text: "Esta acción no se puede deshacer.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Sí, eliminar",
              cancelButtonText: "Cancelar",
              reverseButtons: true,
          }).then(async (result) => {
              if (result.isConfirmed) {
                  await Service.delete(`/rolvista/${row.rolvista_id}/`)
                  Swal.fire({
                      title: "Ruta eliminado",
                      icon: "success",
                      showConfirmButton: false,
                      timer: 1500,
                  })
                  await fetchData()
              }
          })
      } catch (error) {
          Swal.fire({
              title: "Error al eliminar el ruta",
              text: error,
              icon: "error",
              showConfirmButton: false,
              timer: 1500,
          })
      }
    }
  

  const modalFields = [
    { name: "rol_id", label: "Rol", type: "select", options: dataRol },
    { name: "vista_id", label: "Vista", type: "select", options: dataVista },
  ]

  const columns = [
    {
      name: "rolvista_id",
      selector: (row) => row.rolvista_id,
      sortable: true,
      omit: true,
    },
    {
      name: "Rol",
      selector: (row) => row.nombre_rol,
      sortable: true,
    },
    {
      name: "Vista",
      selector: (row) => row.nombre_vista,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex items-center bg-green-500 text-white hover:bg-green-500 hover:bg-opacity-80 gap-2 " onClick={() => handleAction(row)}>
              <CheckIcon className="h-4 w-4" />
          </Button>
        <Button variant="outline" size="sm" className="flex items-center bg-red-500 text-white hover:bg-red-500 hover:bg-opacity-80 gap-2 " onClick={() => handleDelete(row)}>
              <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
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
          <CardTitle className="text-2xl font-bold">Permisos rutas</CardTitle>
          <Button variant="default" size="sm" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Agregar Nueva Ruta
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <DataTableComponent columns={columns} data={data} title="" loading={isLoading} />
          )}
        </CardContent>
      </Card>
      <DynamicModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={selectedRow ? "Editar Ruta" : "Crear Nueva Ruta"}
        fields={modalFields}
        initialData={selectedRow ? { ...selectedRow } : null}
      />
      {notification && (
        <div
          className={`fixed top-10 right-4 p-4 rounded-lg text-white ${
            notification.type === "green" ? "bg-green-500" : "bg-red-500"
          } transition-opacity duration-500 ${notification ? "opacity-100" : "opacity-0"}`}
        >
          {notification.message}
        </div>
      )}
    </div>

    
  )
}

export default TableRolView

