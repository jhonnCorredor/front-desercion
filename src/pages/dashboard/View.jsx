"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DataTableComponent from "@/widgets/datatable/data-table"
import { Service } from "@/data/api"
import { CheckIcon, PlusIcon } from "lucide-react"
import { DynamicModal } from "@/widgets/Modal/DynamicModal"
import { useToast } from "@/components/hooks/use-toast"

export function TableView() {
  const [data, setData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await Service.get("/vistas/")
      setData(response || [])
    } catch (error) {
      console.error("Error al obtener los usuarios:", error)
      setError("Error al cargar los datos. Por favor, intente de nuevo más tarde.")
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
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
        await Service.put(`/vistas/${selectedRow.id}`, formData)
      } else {
        await Service.post("/vistas/", formData, {
estado : false,
        })

        showNotification("green", "Vista creada.");


      }
      await fetchData()
      handleCloseModal()
    } catch (error) {
        showNotification("red", "Error al enviar el correo. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false)
    }
  }

  const modalFields = [
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "descripcion", label: "Descripción", type: "textarea" },
    { name: "ruta", label: "Ruta", type: "text" },
    {name : "icono", label: "icono", type: "text"},

    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
      ],
    },
    { name: "modulo_id", label: "ID del Módulo", type: "number" },
  ]

  const columns = [
    {
      name: "id",
      selector: (row) => row.id,
      sortable: true,
      omit: true,
    },
    {
      name: "nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "descripcion",
      selector: (row) => row.descripcion,
      sortable: true,
    },
    {
      name: "ruta",
      selector: (row) => row.ruta,
      sortable: true,
    },
    {
      name: "estado",
      selector: (row) => row.estado == true ? row.estado = "Activo" : row.estado = "Inactivo", 
      sortable: true,
    },
    {
      name: "modulo_id",
      selector: (row) => row.modulo_id,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => handleAction(row)}>
          <CheckIcon className="h-4 w-4" />
          Editar
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Vistas</CardTitle>
          <Button variant="default" size="sm" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Agregar Nueva Vista
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
        title={selectedRow ? "Editar Vista" : "Crear Nueva Vista"}
        fields={modalFields}
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

export default TableView

