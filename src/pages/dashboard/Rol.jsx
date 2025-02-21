"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
  Select,
  Option,
} from "@material-tailwind/react"
import DataTableComponent from "@/widgets/datatable/data-table"
import { Service } from "@/data/api"
import { CheckIcon } from "@heroicons/react/24/solid"
import { DynamicModal } from "@/widgets/Modal/DynamicModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, TrashIcon, XIcon } from "lucide-react"
import Swal2 from "sweetalert2"

export function TableRol() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await Service.get("/rol/")
      setData(response || [])
    } catch (error) {
      console.error("Error al obtener los roles:", error)
      setError("Error al obtener los roles. Por favor, inténtalo de nuevo más tarde.")
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSubmit = async (formData) => {
    try {
      if (selectedRow) {
        await Service.put(`/rol/${selectedRow.id}/`, formData)
      } else {
        await Service.post("/rol/", formData)
      }
      fetchData()
      setIsModalOpen(false)
      setSelectedRow(null)
      Swal2.fire({
        icon: "success",
        title: "Rol guardado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al guardar el rol:", error)
      setError("Error al guardar el rol. Por favor, inténtalo de nuevo más tarde.")
      Swal2.fire({
        icon: "error",
        title: "Error al guardar el rol",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  const handleDelete = async (row) => {
    Swal2.fire({
      title: "¿Estás seguro de eliminar este rol?",
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
        try {
          await Service.delete(`/rol/${row.id}/`)
          Swal2.fire({
            title: "Rol eliminado",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          })
          await fetchData()
        } catch (error) {
          console.error("Error al eliminar el rol:", error)
          Swal2.fire({
            title: "Error",
            text: "No se pudo eliminar el rol. Por favor, inténtalo de nuevo más tarde.",
            icon: "error",
            position: "bottom-right",
            showConfirmButton: false,
            timer: 1500,
          })
        }
      }
    })
  }
  

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAction = (row) => {
    setSelectedRow(row)
    setIsModalOpen(true)
    modalFields.forEach(field => {
      field.value = row[field.name] || "";
    });
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRow(null)
  }

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
      name: "Acciones",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button color="green" size="sm" className="flex items-center gap-2" onClick={() => handleAction(row)}>
            <CheckIcon className="h-4 w-4" />
          </Button>

          <Button color="red" size="sm" className="flex items-center gap-2" onClick={() => handleDelete(row)}>
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

  const modalFields = [
    {
      label: "Nombre",
      name: "nombre",
      type: "text",
      required: true,
      value: selectedRow?.nombre || "",
    },
    {
      label: "Descripción",
      name: "descripcion",
      type: "text",
      required: true,
      value: selectedRow?.descripcion || "",
    },
  ]

  return (
    <div className="mt-6 mb-8 space-y-6 bg-gradient-to-br from-blue-gray-50 rounded-xl min-h-screen via-white to-white">
      <Card className="bg-gradient-to-br from-blue-gray-50 rounded-xl min-h-screen via-white to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Gestión de Roles</CardTitle>
          <Button variant="default" size="sm" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Agregar Nuevo Rol
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
        title={selectedRow ? "Editar Rol" : "Crear Nuevo Rol"}
        fields={modalFields}
        onSubmit={handleSubmit}
        initialData={selectedRow ? { ...selectedRow } : null}
      />
    </div>
  )
}

export default TableRol
