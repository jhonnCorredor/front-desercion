"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DataTableComponent from "@/widgets/datatable/data-table"
import { Service } from "@/data/api"
import { CheckIcon, PlusIcon, TrashIcon } from "lucide-react"
import { DynamicModal } from "@/widgets/Modal/DynamicModal"
import { useToast } from "@/components/hooks/use-toast"
import Swal from "sweetalert2"

export function TableView() {
  const [data, setData] = useState([])
  const [dataModule, setDataModule] = useState([])
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

  const fetchModule = async () => {
    try {
      const response = await Service.get("/modulos/")

      setDataModule(response.map((item) => ({
        value: item.id,
        label: item.nombre,
      }))
      )
    } catch (error) {
      console.error("Error al obtener los módulos:", error)
      setDataModule([])
    }
  }

  useEffect(() => {
    fetchData()
    fetchModule()
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
        Swal.fire({
          title: "vista actualizada",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
      })
      } else {
        await Service.post("/vistas/", formData, {
estado : false,
        })

        Swal.fire({
          title: "vista guardada",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
      })

      }
      await fetchData()
      handleCloseModal()
    } catch (error) {
      Swal.fire({
        title: "Error al guardar la vista",
        text: error,
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
    })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (row) => {
    try {
        Swal.fire({
            title: "¿Estás seguro de eliminar esta vista?",
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
                await Service.delete(`/vistas/${row.id}/`)
                Swal.fire({
                    title: "vista eliminada",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                })
                await fetchData()
            }
        })
    } catch (error) {
        Swal.fire({
            title: "Error al eliminar la vista",
            text: error,
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
        })
    }
  }

  const modalFields = [
    { name: "nombre", label: "Nombre", type: "text" },
    { name: "descripcion", label: "Descripción", type: "textarea" },
    { name: "ruta", label: "Ruta", type: "text" },
    {name : "icono", label: "icono", type: "text"},
    { name: "modulo_id", label: "ID del Módulo", type: "select", options: dataModule },
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
      name: "modulo_id",
      selector: (row) => dataModule.find((item) => item.value === row.modulo_id)?.label,
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
    },
  ]

  return (
    <div className=" mt-8 mb-8 space-y-6">
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

export default TableView

